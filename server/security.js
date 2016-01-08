// Premit admins to create and modify users
Meteor.users.permit(['insert', 'update']).ifHasRole('admin').apply();

// Never remove a user
Meteor.users.permit(['remove']).never().apply();

// Logged in users can create records in DABText
DABText.permit(['insert']).ifLoggedIn().apply();

// Never change or delete a record in DABText
DABText.permit(['update', 'remove']).never().apply();
