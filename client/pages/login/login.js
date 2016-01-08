Template.login.events({
  "submit #login": function(event, template){
    var username = event.target.username.value;
    var password = event.target.password.value;
    sAlert.closeAll(); // close all previous errors
    Meteor.loginWithPassword({username: username}, password, function(error) {
      if (error) {
        sAlert.error('Wrong username or password');
      }
    });
    return false;
  }
});
