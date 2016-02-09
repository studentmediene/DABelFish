// Shared methods

Meteor.methods({
  addUser: function(user) {

    check(user, Object);
    password = Random.secret(10);

    if(Meteor.settings.DEBUG) {
      password = "secret";
    }

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

    if(!Meteor.settings.DEBUG) {
      Mail.send({
        to: user.username,
        from: "Radioteknisk <radioteknisk@studentmediene.no>",
        subject: "You can now sign in at dab.radiorevolt.no",
        text: "An administrator has created a new account with this email at dab.radiorevolt.no.\n" +
        "You are now registrerd with the following information\n\n" +
        "Name: " + user.profile.name + "\n" +
        "Email: " + user.username + "\n" +
        "Password: " + password + "\n\n" +
        "The first time you sign in, you'll have to change the password.\n\n" +
        "If you have any questions, please reply to this email.\n\n" +
        "-- \n" +
        "Radioteknisk"
      });
    }
    Meteor.call("user_logger", user.createdBy + " created the user '" + user.profile.name + "'", userId);
  },
  resetUserPassword: function(userId) {
    password = Random.secret(10);

    if (Meteor.settings.DEBUG) {
      password = "secret"
    }

    user = Meteor.users.findOne({_id: userId});
    admin = Meteor.users.findOne({_id: this.userId});

    if(!user) {
      throw new Meteor.Error(400, "None-existing user");
    }

    Meteor.runRestricted(function() {
      Accounts.setPassword(userId, password);
      if(!Meteor.settings.DEBUG){
        Mail.send({
          to: user.username,
          from: "Radioteknisk <radioteknisk@studentmediene.no>",
          subject: "New password at dab.radiorevolt.no",
          text: "An administrator has reset your password.\n" +
          "Your new password is: " + password
        });
      }
    });
    Meteor.call("user_logger", admin.profile.name + " reset " + user.profile.name + "'s password", userId);
  },
  addToRole: function(userId, role) {
    check(role, String);
    check(userId, String);

    modifier = {
      $push: {roles: role}
    }

    Security.can(this.userId).update(userId, modifier).for(Meteor.users).throw();

    admin = Meteor.users.findOne({_id: this.userId});
    user = Meteor.users.findOne({_id: userId});

    Roles.addUsersToRoles(userId, role);

    Meteor.call("user_logger", admin.profile.name + " added " + user.profile.name + " to role: " + role, userId);
  },
  removeFromRole: function(userId, role) {
    check(role, String);
    check(userId, String);

    modifier = {
      $pull: {roles: role}
    }

    Security.can(this.userId).update(userId, modifier).for(Meteor.users).throw();

    admin = Meteor.users.findOne({_id: this.userId});
    user = Meteor.users.findOne({_id: userId});

    Roles.removeUsersFromRoles(userId, role);
    Meteor.call("user_logger", admin.profile.name + " removed " + user.profile.name + " from role: " + role, userId);
  },
  addText: function(text) {

    check(text, Object);

    text.createdByID = this.userId;
    text.createdBy = Meteor.user().profile.name;

    Security.can(this.userId).insert(text).for(DABText).throw();

    user = Meteor.users.findOne({_id: this.userId});

    DABText.insert(text);

    Meteor.call("user_logger", user.profile.name + " added DAB-text: '" + text.text + "'", this.userId);

    sendDABTextFTP();

  },
  resetText: function() {
    text = {
      text: getCurrentShow(),
      createdBy: Meteor.user().profile.name,
      createdByID: this.userId
    }

    Security.can(this.userId).insert(text).for(DABText).throw();

    user = Meteor.users.findOne({_id: this.userId});

    Meteor.call("user_logger", user.profile.name + " reset DAB-text to default", this.userId);

    DABText.insert(text);

    sendDABTextFTP();
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
  },
  user_logger: function(action, userId) {
    var obj = {
      action: action,
      createdById: this.userId,
      userId: userId,
      createdBy: Meteor.user().profile.name
    }
    Security.can(this.userId).insert(obj).for(UserLog).throw();

    UserLog.insert(obj);
  },
  DABTextCount: function() {
    return DABText.find().count();
  },
  UserLogCount: function(userId) {
    return UserLog.find({$or: [{createdById: userId}, {userId: userId}]}).count();
  }
});

// Private methods

getCurrentShow = function() {
  var data = {};
  try {
    var data = HTTP.get(Meteor.settings.radioAPI.currentShows, {timeout: 1000}).data;
  }
  catch(e){
    console.log("ERROR!");
    console.log(e);
    data = {};
  }
  if (data.current){
    return data.current.title;
  }
  return "Radio Revolt, Studentradioen i Trondheim";
}

resetDabText = function() {
  DABText.insert({
    text: getCurrentShow(),
    createdBy: "GLaDOS",
    createdByID: Random.id()
  });
  sendDABTextFTP();
}

checkResetDabText = function() {
  var text = DABText.findOne({}, {
    sort: {createdAt: -1}
  });
  if (text.lastUntil){
    if (new Date() > text.lastUntil)
      resetDabText();
  }
}
