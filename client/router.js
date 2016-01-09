/* Client-side router settings */

Router.configure({
  layoutTemplate:"layout",
  notFoundTemplate:"page_not_found",
  loadingTemplate:"loading"
});

Router.route("/", {
  name:"home",
  template:"home"
});

Router.route("/profile", {
  name:"profile",
  template:"profile"
});

Router.route("/admin", {
  name:"admin",
  template:"admin"
});

Router.route("/user/:_id", {
  name:"user",
  template:"user",
  data: function(){
     return Meteor.users.findOne({_id: this.params._id});
  }
});
