/* Client-side router settings */

Router.configure({
  layoutTemplate:"layout"
});

Router.route("/", {
  name:"home",
  template:"home"
});

Router.route("/log", {
  name:"log",
  template:"log"
});

Router.route("/admin", {
  name:"admin",
  template:"admin"
});

// Probably insecure
Router.onBeforeAction(function() {
  if (!Meteor.userId()) {
    this.render("login");
  } else {
    this.next();
  }
});
