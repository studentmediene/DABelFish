/* Controller for home page */

Template.home.rendered = function(){
  Session.set("dabTextCursor", 0);
}


Template.home.helpers({
  textLimit: function() {
    return 140;
  },
  currentText: function() {
    return DABText.findOne({}, {
      sort: {createdAt: -1}
    });
  },
  formatDate: function(date) {
    return moment(date).calendar(null, {
      sameDay: '[Today at] HH:mm',
      lastDay: '[Yesterday at] HH:mm',
      lastWeek: '[Last] dddd [at] HH:mm',
      thisWeek: 'dddd [at] HH:mm',
      sameElse: 'dddd DD/MM/YY [at] HH:mm'
    });
  },
  texts: function() {
    return DABText.find({}, {sort: {createdAt: -1}});
  }
});

Template.home.events({
  "submit #new-text": function(event, template) {
    var text = event.target.text.value;

    if(!text) {
      sAlert.error("The text cannot be empty");
      return false;
    }
    if (!Meteor.userId()) {
      sAlert.error("You must logg in to do this");
      return false;
    }

    Meteor.call("addText", {
      text: text
    }, function(error, result){
      if(error){
        sAlert.error(error.reason);
        console.log("error", error);
      } else {
        sAlert.success("Success!");
        event.target.text.value = "";
      }
    });
    return false;
  },
  "click #pagination-newer": function(event, template) {
    var cursor = Number(Session.get("dabTextCursor"));
    if(cursor >= 20)
      Session.set("dabTextCursor", cursor - 20);
  },
  "click #pagination-older": function(event, template) {
    var cursor = Number(Session.get("dabTextCursor"));
    Meteor.call("DABTextCount", function(error, result){
      if(error){
        console.log("error", error);
        return;
      }
      if(Number(result) > cursor + 20){
         Session.set("dabTextCursor", cursor + 20)
      }
    });

  },
  "click #reset-text": function(event, template) {
    Meteor.call("resetText", function(error, result){
      if(error){
        sAlert.error(error.reason);
        console.log("error", error);
      } else {
        sAlert.success("Text reset to default");
      }
    });
  }
});
