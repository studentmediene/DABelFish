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

Router.route("/admin", {
  name:"admin",
  template:"admin"
});
