// Test if the doc is the current user's doc
Security.defineMethod("ifIsCurrentUser", {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId, doc) {
    return userId !== doc._id;
  }
});

// Premit admins to create and modify users
Meteor.users.permit(['insert', 'update']).ifHasRole('admin').apply();

// Premits users to change their own password and userprofiles
Meteor.users.permit(['update']).ifIsCurrentUser().onlyProps(['services.password', 'profile']);

// Never remove a user
Meteor.users.permit(['remove']).never().apply();

// Logged in users can create records in DABText
DABText.permit(['insert']).ifLoggedIn().apply();

// Never change or delete a record in DABText
DABText.permit(['update', 'remove']).never().apply();

// Logged in users can create records in UserLog
UserLog.permit(["insert"]).ifLoggedIn().apply();

// Never change or delete a record in UserLog
UserLog.permit(["update", "remove"]).never().apply();