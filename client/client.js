/* Client-side code */

Session.set("dabTextCursor", 0);

Accounts.onLogin(function(){
  Tracker.autorun(function(){
     Meteor.subscribe("dabText", Session.get("dabTextCursor"));
  });
  Meteor.subscribe("allUserData");
  Meteor.subscribe("userLog");
});

sAlert.config({
  effect: 'slide',
  position: 'bottom-right'
});
