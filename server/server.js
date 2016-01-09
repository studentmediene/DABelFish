/* Server-side code */

Meteor.publish("allUserData", function() {
  if(Roles.userIsInRole(this.userId, 'admin')){
    return Meteor.users.find();
  } else {
    this.stop();
    return;
  }
});

Meteor.publish("dabText", function() {
  return DABText.find();
});

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
});
