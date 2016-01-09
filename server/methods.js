/* Shared server-side methods */

Meteor.methods({
  addUser: function(user, password) {

    check(user, Object);
    check(password, String);

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
  addToRole: function(userId, role) {
    check(role, String);
    check(userId, String);

    modifier = {
      $push: {roles: role}
    }

    Security.can(this.userId).update(userId, modifier).for(Meteor.users).throw();

    Roles.addUsersToRoles(userId, role);
  },
  removeFromRole: function(userId, role) {
    check(role, String);
    check(userId, String);

    modifier = {
      $pull: {roles: role}
    }

    Security.can(this.userId).update(userId, modifier).for(Meteor.users).throw();

    Roles.removeUsersFromRoles(userId, role);
  },
  addText: function(text) {

    check(text, Object);

    text.createdByID = this.userId;
    text.createdBy = Meteor.user().profile.name;

    Security.can(this.userId).insert(text).for(DABText).throw();

    DABText.insert(text);
  },
  resetText: function() {
    text = {
      // Temporary default text
      text: "Radio Revolt, studentradioen i Trondheim",
      createdBy: "GLaDOS",
      createdByID: Random.id()
    }

    Security.can(this.userId).insert(text).for(DABText).throw();

    DABText.insert(text);
  },
  checkPassword: function (digest) {
    // This is kind of a hack, and might brake in the future.
    if(this.userId) {
      var user = Meteor.user();
      var password = {digest: digest, algorithm: 'sha-256'};
      var result = Accounts._checkPassword(user, password);
      return result.error == null;
    } else {
      return false;
    }
  }
});
