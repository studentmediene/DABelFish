/* Client-side code */

Session.set("dabTextCursor", 0);
Session.set("userActivityCursor", 0);
Session.set("userActivityID", Meteor.userId());

Accounts.onLogin(function(){
  Meteor.autorun(function(){
     Meteor.subscribe("dabText", Session.get("dabTextCursor"));
     Meteor.subscribe("userLog", Session.get("userActivityCursor"), Session.get("userActivityID"));
  });
  Meteor.subscribe("allUserData");
});

sAlert.config({
  effect: 'slide',
  position: 'bottom-right'
});
