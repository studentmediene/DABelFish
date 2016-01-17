/* Controller for admin page */

Template.admin.rendered = function() {
  Session.set("userPageValue", {
    "all-users": true,
    "admin-users": false,
    "regular-users": false,
    "disabled-users": false
  });
}

Template.admin.helpers({
  formatDate: function(date) {
    return moment(date).calendar(null, {
      sameDay: '[Today at] HH:mm',
      lastDay: '[Yesterday at] HH:mm',
      lastWeek: '[Last] dddd [at] HH:mm',
      thisWeek: 'dddd [at] HH:mm',
      sameElse: 'dddd DD/MM/YY [at] HH:mm'
    });
  },
  isAdmin: function() {
    return Roles.userIsInRole(this._id, 'admin');
  },
  current_role: function() {
    for (var usr in Session.get("userPageValue")){
      if (Session.get("userPageValue")[usr]){
        return usr;
      }
    }
    return "all-users";
  },
  users: function() {
    var active = false;
    for (var usr in Session.get("userPageValue")){
      if (Session.get("userPageValue")[usr]){
        active = usr;
        break;
      }
    }
    var role = "";
    if (active === "admin-users")
      role = "admin";
    else if (active === "regular-users")
      role = "user";
    else if (active === "disabled-users")
      role = "disabled";
    else
      return Meteor.users.find({}, {
        sort: {"profile.name": 1}
      });
    return Meteor.users.find({roles: role}, {
      sort: {"profile.name": 1}
    });
  }
});

Template.admin.events({
  "submit #addUser": function(event, template){
    var username = event.target.username.value;
    var name = event.target.name.value;
    var admin = event.target.admin.checked;

    // Validation
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!username) {
      sAlert.error("Provide an email");
      return false;
    }
    if(!re.test(username)) {
      sAlert.error("Provide a valid email");
      return false;
    }
    if(!name) {
      sAlert.error("Provide a name");
      return false;
    }

    user = {
      username: username,
      profile: {
        name: name
      }
    }

    if(admin) {
      user.roles = ['admin'];
    } else {
      user.roles = ['user'];
    }

    // Add user
    Meteor.call("addUser", user, function(error, result){
      if(error){
        sAlert.error(error.reason);
        console.log("error", error);
      } else {
        sAlert.success('User added');
        event.target.username.value = "";
        event.target.name.value = "";
        event.target.admin.checked = false;
      }
    });
    return false;
  },
  "click .usr-bar": function(event, template) {
    var obj = {};
    for (var usr in Session.get("userPageValue")){
      $("#" + usr).removeClass("active");
      obj[usr] = false;
    }

    obj[event.currentTarget.id] = true;
    $("#" + event.currentTarget.id).addClass("active");
    Session.set("userPageValue", obj);
  }
});
