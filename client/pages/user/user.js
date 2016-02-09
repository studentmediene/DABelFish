
Template.user.rendered = function() {
  Session.set("userActivityCursor", 0);
  Session.set("userActivityID", this.data._id);

}

Template.user.helpers({
  inRole: function(role){
    check(role, String);
    return _.contains(this.roles, role);
  },
  actions: function() {
    // This should not be needed, but the sorting failed without..
    return UserLog.find({}, {sort: {createdAt: -1}});
  },
  formatDate: function(date) {
    return moment(date).calendar(null, {
      sameDay: '[Today at] HH:mm',
      lastDay: '[Yesterday at] HH:mm',
      lastWeek: '[Last] dddd [at] HH:mm',
      thisWeek: 'dddd [at] HH:mm',
      sameElse: 'dddd DD/MM/YY [at] HH:mm'
    });
  }
});

Template.user.events({
  "click #disableUser": function(event, template){
    Meteor.call("addToRole", this._id, "disabled", function(error, result){
      if(error){
        sAlert.error("Could not disable user");
        console.log("error", error);
      } else {
        sAlert.success("User disabled");
      }
    });
  },
  "click #enableUser": function(event, template){
    Meteor.call("removeFromRole", this._id, "disabled", function(error, result){
      if(error){
        sAlert.error("Could not enable user");
        console.log("error", error);
      } else {
        sAlert.success("User enabled");
      }
    });
  },
  "click #addAdmin": function(event, template){
    Meteor.call("addToRole", this._id, "admin", function(error, result){
      if(error){
        sAlert.error("Could not pull admin priveleges");
        console.log("error", error);
      } else {
        sAlert.success("Blessed the user with admin privileges");
      }
    });
  },
  "click #removeAdmin": function(event, template){
    Meteor.call("removeFromRole", this._id, "admin", function(error, result){
      if(error){
        sAlert.error("Could not give admin priveleges");
        console.log("error", error);
      } else {
        sAlert.success("Zapped the users admin privileges");
      }
    });
  },
  "click #resetPassword": function(event, template){
    Meteor.call("resetUserPassword", this._id, function(error, result){
      if(error){
        sAlert.error("Unable to reset password");
        console.log("error", error);
      } else {
        sAlert.success("A new password is sendt to the users by email");
      }
    });
  },
  "click #pagination-newer": function(event, template) {
    var cursor = Number(Session.get("userActivityCursor"));
    if(cursor >= 10)
      Session.set("userActivityCursor", cursor - 10);
  },
  "click #pagination-older": function(event, template) {
    var cursor = Number(Session.get("userActivityCursor"));
    var id = Session.get("userActivityID");
    Meteor.call("UserLogCount", id, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(Number(result) > cursor + 10){
        Session.set("userActivityCursor", cursor + 10);
      }
    });

  }
});
