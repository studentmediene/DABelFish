// Shared methods

var automatic = false;

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
        text: "An administrator has created a new account with this email at rrdab.meteor.com.\n" +
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
    Meteor.call("user_logger", "User created", userId);
  },
  resetUserPassword: function(userId) {
    password = Random.secret(10);

    if (Meteor.settings.DEBUG) {
      password = "secret"
    }

    user = Meteor.users.findOne({_id: userId});

    if(!user) {
      throw new Meteor.Error(400, "None-existing user");
    }

    Meteor.runRestricted(function() {
      Accounts.setPassword(userId, password);
      if(!Meteor.settings.DEBUG){
        Mail.send({
          to: user.username,
          from: "Radioteknisk <radioteknisk@studentmediene.no>",
          subject: "New password at rrdab.meteor.com",
          text: "An administrator has reset your password.\n" +
          "Your new password is: " + password
        });
      }
    });
    Meteor.call("user_logger", "New password sent to mail.", userId);
  },
  addToRole: function(userId, role) {
    check(role, String);
    check(userId, String);

    modifier = {
      $push: {roles: role}
    }

    Security.can(this.userId).update(userId, modifier).for(Meteor.users).throw();

    Roles.addUsersToRoles(userId, role);

    Meteor.call("user_logger", "Role added: " + role, userId);
  },
  removeFromRole: function(userId, role) {
    check(role, String);
    check(userId, String);

    modifier = {
      $pull: {roles: role}
    }

    Security.can(this.userId).update(userId, modifier).for(Meteor.users).throw();

    Roles.removeUsersFromRoles(userId, role);
    Meteor.call("user_logger", "Role removed: " + role, userId);
  },
  addText: function(text, time_limit) {

    check(text, Object);

    text.createdByID = this.userId;
    text.createdBy = Meteor.user().profile.name;

    if (time_limit){
      check(time_limit, Number);
      if (time_limit < 60 && time_limit >= 1) {
        text.lastUntil = new Date(new Date().getTime() + time_limit * 60000);
      }
    }

    Security.can(this.userId).insert(text).for(DABText).throw();

    DABText.insert(text);

    sendDABTextFTP();

  },
  resetText: function() {
    text = {
      text: getCurrentShow().title,
      createdBy: Meteor.user().profile.name,
      createdByID: this.userId
    }

    Security.can(this.userId).insert(text).for(DABText).throw();

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
  switch_automatic: function(auto) {
    if (!Meteor.user()){
      throw new Meteor.Error(401, "You do not have access.");
    }
    // Session.set("automatic", auto);
    automatic = auto;
    setAutomaticShowAndSongs();
  }
});

// Private methods

getCurrentShow = function() {
  return HTTP.get(Meteor.settings.radioAPI.currentShows).data.current;
}

getCurrentSong = function() {
  return HTTP.get(Meteor.settings.radioAPI.currentSongs).data;
}

resetDabText = function() {
  DABText.insert({
    text: getCurrentShow().title,
    createdBy: "GLaDOS",
    createdByID: Random.id()
  });
  sendDABTextFTP();
}

// Check if a dab text will, 
checkResetDabText = function() {
  var text = DABText.findOne({}, {
    sort: {createdAt: -1}
  });
  if (new Date() > text.lastUntil){
    resetDabText();
  }
}

// Prioritize in this order song, custom text, show, radio name
setAutomaticShowAndSongs = function() {
  if (!automatic){
    checkResetDabText();
    return;
  }
  var songs = getCurrentSong();
  var show = getCurrentShow();

  // cron cannot still get userId, must find another way to find last 
  // dabtext set by user.
  // var lastSetText = DABText.findOne({createdByID: Meteor.userId()}, {
  //   sort: {createdAt: -1}
  // });
  var lastSetText = {createdAt: undefined};

  var text = "Radio Revolt, Studentradioen i Trondheim";
  if (songs.current.title){
    text = songs.current.title;
  }
  else if (lastSetText.lastUntil && lastSetText.createdAt.getHours() == new Date().getHours()){
    text = lastSetText.text;
  }
  else if (show){
    text = show.title;
  }
  if (text == DABText.findOne({}, {
    sort: {createdAt: -1}
  }).text)
    return;
  DABText.insert({
    text: text,
    // Metor.userId() can only be called from a user, not from cron
    // createdBy: Meteor.user().profile.name,
    // createdByID: Meteor.userId()
    createdBy: "GLaDOS",
    createdByID: Random.id()
  });
  sendDABTextFTP();
}
