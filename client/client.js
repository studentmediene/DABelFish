/* Client-side code */

Accounts.onLogin(function(){
  Meteor.subscribe("dabText");
  Meteor.subscribe("allUserData");
  Meteor.subscribe("userLog");
});

sAlert.config({
  effect: 'slide',
  position: 'bottom-right'
});
