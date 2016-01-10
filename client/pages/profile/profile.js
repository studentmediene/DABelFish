Template.profile.events({
  "submit #change-password": function(event, template){
     var oldPassword = event.target.oldPassword.value;
     var newPassword1 = event.target.newPassword1.value;
     var newPassword2 = event.target.newPassword2.value;

     // Validation
     if(newPassword1 != newPassword2) {
       sAlert.error("The passwords do not match");
       return false;
     }

     Accounts.changePassword(oldPassword, newPassword1, function(error){
       if(error) {
         sAlert.error(error.reason);
       } else {
         sAlert.success("Password changed");
         Meteor.logoutOtherClients(function(error) {
           if(error) {
             sAlert.warning("Did not manage to log out other logged in clients");
             console.log("error", error);
           }
         });
         event.target.oldPassword.value = "";
         event.target.newPassword1.value = "";
         event.target.newPassword2.value = "";
         Meteor.call("user_logger", "Changed password.", Meteor.user()._id);
       }
     });
     
     return false;
  }
});
