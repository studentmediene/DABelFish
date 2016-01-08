/* Shared server-side methods */

Meteor.methods({
  addUser: function(user, password) {
    user.createdByID = this.userId;
    user.createdBy = Meteor.user().profile.name;

    // Produces better errors than Meteor.runRestricted
    Security.can(this.userId).insert(user).for(Meteor.users).throw();

    if(!!Meteor.users.findOne({username: user.username})){
      throw new Meteor.Error(400, "Username is taken");
    }

    userId = Meteor.users.insert(user);
    
    if(userId) {
      Accounts.setPassword(userId, password);
    }
  },
  setPassword: function(userId, password) {
    Meteor.runRestricted(function() {
      Accounts.setPassword(userId, password);
    });
  },
  makeAdmin: function(userId) {
    Meteor.runRestricted(function() {
      Roles.addUsersToRoles(userId, "admin");
    });
  }
});
