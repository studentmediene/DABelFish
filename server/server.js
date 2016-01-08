/* Server-side code */

Meteor.publish("allUserData", function() {
  return Meteor.users.find();
});

Meteor.publish("DABText", function() {
  return DABText.find({}, {
    //skip: Session.get("DABText_skip"),
    limit: 30
  });
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
      createdBy: "System_1337",
      createdByID: Random.id()
    });
    Accounts.setPassword(userId, "secret");
  }
});
