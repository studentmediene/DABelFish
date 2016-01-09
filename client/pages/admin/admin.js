/* Controller for admin page */

Template.admin.helpers({
  users: function(){
    return Meteor.users.find({},{
      sort: {"profile.name": 1}
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
  isAdmin: function() {
    return Roles.userIsInRole(this._id, 'admin');
  }
});

Template.admin.events({
  "submit #addUser": function(event, template){
    var password = event.target.password.value;
    user = {
      username: event.target.username.value,
      profile: {
        name: event.target.name.value
      }
    }
    if(event.target.admin.checked) {
        user.roles = ['admin'];
    } else {
      user.roles = ['user'];
    }
    // Add user
    Meteor.call("addUser", user, password, function(error, result){
      if(error){
        sAlert.error(error.reason);
        console.log("error", error);
      } else {
        sAlert.success('User added');
        event.target.username.value = "";
        event.target.password.value = "";
        event.target.name.value = "";
        event.target.admin.checked = false;
      }
    });
    return false;
  }
});
