/* Client-side code */
Meteor.startup(function(){
  Session.setDefault("DABText_skip", 0);
});

Meteor.subscribe("DABText");
Meteor.subscribe("allUserData");

sAlert.config({
  effect: 'slide',
  position: 'bottom-right'
});
