Security.defineMethod("isAdmin", {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId) {
    return !Roles.userIsInRole(userId, 'admin');
  }
});

Meteor.users.permit(['insert', 'update', 'remove']).ifHasRole('admin').apply();
