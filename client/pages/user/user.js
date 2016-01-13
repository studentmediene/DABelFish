
Template.user.rendered = function() {
  Session.set("userActivityCursor", 0);
  Session.set("userActivityText", true);
}

Template.user.helpers({
  inRole: function(role){
    check(role, String);
    return _.contains(this.roles, role);
  },
  actions: function() {
    cursor = Session.get("userActivityCursor");
    if (Session.get("userActivityText")){
      return DABText.find({createdByID: this._id}, {
        sort: {createdAt: -1},
        skip: cursor || 0,
        limit: 10
      });
    }
    return UserLog.find({userId: this._id}, {
      sort: {createdAt: -1},
      skip: cursor || 0,
      limit: 10
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
  paginationNewerDisabled: function() {
    if(Number(Session.get("userActivityCursor")) < 10)
      return "disabled";
    return "";
  },
  paginationOlderDisabled: function() {
    var num = - 10;
    if (Session.get("userActivityText")){
      num += DABText.find({createdByID: this._id}).count();
    }else{
      num += UserLog.find({userId: this._id}).count();
    }
    if(Number(Session.get("userActivityCursor")) >= num)
      return "disabled";
    return "";
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
    Meteor.call("resetPassword", this._id, this.username, function(error, result){
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
    var count = - 10;
    if (Session.get("userActivityText")){
      count += DABText.find({createdByID: this._id}).count();
    } else {
      count += UserLog.find({userId: this._id}).count();
    }
    if(cursor < count)
      Session.set("userActivityCursor", cursor + 10);
  },
  "click #other-activity": function(event, template){
    Session.set("userActivityCursor", 0);
    Session.set("userActivityText", false);
    $("#other-activity").addClass("active");
    $("#dab-texts").removeClass("active");
  },
  "click #dab-texts": function(event, template) {
    Session.set("userActivityCursor", 0);
    Session.set("userActivityText", true);
    $("#other-activity").removeClass("active");
    $("#dab-texts").addClass("active");
  }
});
