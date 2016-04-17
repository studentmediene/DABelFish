/* Server-side code */

Meteor.publish("allUserData", function() {
  if(Roles.userIsInRole(this.userId, 'admin')){
    return Meteor.users.find();
  } else {
    this.stop();
    return;
  }
});

Meteor.publish("dabText", function(s) {
  if(this.userId){
    return DABText.find({}, {
      sort: {createdAt: -1},
      skip: s || 0,
      limit: 20
    });
  }
});

Meteor.publish("userLog", function(s, u) {
  if (Roles.userIsInRole(this.userId, "admin")){
    return UserLog.find({$or: [{createdById: u}, {userId: u}]}, {
      sort: {createdAt: -1},
      skip: s || 0,
      limit: 10
    });
  } else {
    this.stop();
    return;
  }
})

Meteor.startup(function(){
  if(!Meteor.users.findOne()) {
    console.log("Found no users in the database, creating the default user.");
    userId = Meteor.users.insert({
      username: "radioteknisk@studentmediene.no",
      roles: ["admin"],
      profile: {
        name: "Radioteknisk"
      },
      createdBy: "GLaDOS",
      createdByID: Random.id()
    });
    Accounts.setPassword(userId, "secret");
  }
  
  Api = new Restivus({
    version: "v1",
    useDefaultAuth: true,
    prettyJson: true
  });

  Api.addCollection(DABText);

  // Api-url: /api/v1/dabtext
  Api.addRoute("dabtext/time/:time", {authRequired: false}, {
    get: {
      action: function() {
        var date = new Date(this.urlParams.time);
        if (isNaN(date)){
          date = Number(this.urlParams.time);
          if (!date)
            return {
              status: "error",
              message: "Invalid time."
            };
        }
        else {
          date = date.getTime()
        }

        var BreakException = {};
        var data;
        try {
          DABText.find({}, {
            sort: {createdAt: -1}
          }).forEach(function(name) {
            if (name.createdAt.getTime() <= date){
                data = {
                status: "success",
                data: {
                  text: name.text,
                  from: name.createdAt,
                  from_sec: name.createdAt.getTime()
                }
              }

              // Just used for breaking the forEach statement
              // so that it does not run over all the data
              // when it has found a maching text.
              throw BreakException;
            }
          });
        }
        // If an exception is throwed, it means that there are found a text
        catch (e) {
          return data;
        }
        return {
          status: "error",
          message: "No text found on that date."
        }
      }
    }
  });
});
