# DABelFish

## Packages we use

### [twbs:bootstrap](https://atmospherejs.com/twbs/bootstrap)

This package adds the bootstrap stylesheets (css) and javascript (js).

### [accounts-password](https://atmospherejs.com/meteor/accounts-password)

This package adds general useraccount-features.

Users can be found in `Meteor.users`. Every user has a unique ID. The ID of the
current user can be found with `Meteor.userId()`. This returns undefined if the
user is not logged in. You can also use `{{ currentUser }}` in all templates
without use of any helper functions, and this calls the
`Meteor.userId()`-function.

### [useraccounts:bootstrap](https://github.com/meteor-useraccounts/core/blob/master/Guide.md)

Adds highly customizable form-templates for sign-in and sign-up, styled for
Twitter Bootstrap.

Add `{{> atForm}}` to show the sign-in/sign-up forms in a template. See the
[documentation](https://github.com/meteor-useraccounts/core/blob/master/Guide.md#basic-customization)
for configuration.

### [Iron Router](https://atmospherejs.com/iron/router)

Gives routing functionality. Both client- and server-side. See the
[documentation](http://iron-meteor.github.io/iron-router/) for more information.
