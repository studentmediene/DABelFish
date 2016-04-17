# DABelFish

## Packages we use

### [twbs:bootstrap](https://atmospherejs.com/twbs/bootstrap)

This package adds the bootstrap stylesheets (css) and javascript (js).

### [accounts-password](https://atmospherejs.com/meteor/accounts-password)

This package adds general useraccount-features.

Users can be found in `Meteor.users`. Every user has a unique ID. The ID of the current user can be found with `Meteor.userId()`. This returns undefined if the user is not logged in. You can also use `{{ currentUser }}` in all templates without use of any helper functions, and this calls the `Meteor.userId()`-function.

### [iron:router](https://atmospherejs.com/iron/router)

Gives routing functionality, both client- and server-side. See the [documentation](http://iron-meteor.github.io/iron-router/) for more information.

### [aldeed:collection2](https://atmospherejs.com/aldeed/collection2)

Adds support for defining schemas for collections, see lib/schemas.js for our schemas, and [their github page](https://github.com/aldeed/meteor-collection2/) for documentation.

### [ongoworks:security](https://atmospherejs.com/ongoworks/security)

Adds security to client-side operations to collections (insert, update, remove). Our security is defined in server/security.js. Read [the documentation](https://github.com/ongoworks/meteor-security/) for more information on usage.

### [juliancwirko:s-alert](https://atmospherejs.com/juliancwirko/s-alert)

Client side alert boxes, for feedback. See [the documentation](https://github.com/juliancwirko/meteor-s-alert/) for usage. We also uses the [juliancwirko:s-alert-slide](https://atmospherejs.com/juliancwirko/s-alert-slide) style package.

### [alanning:roles](https://atmospherejs.com/alanning/roles)

Adds roles to users. We could have implemented this easily our self, but it integrates nicely with the security package, and makes life easier. See [github](https://github.com/alanning/meteor-roles/) for documentation.

### [momentjs:moment](https://atmospherejs.com/momentjs/moment)

Converts ISO-time to a nice readable string. [Documentation](http://momentjs.com/docs/).

### [check](https://atmospherejs.com/meteor/check)

Adds the `check()`-function, which checks if a variable matches a type or pattern. E.g.: `check(myVar, String)` to check if myVar is a string. See [docs](https://atmospherejs.com/meteor/check) for usage.

### [dispatch:run-as-user](https://atmospherejs.com/dispatch/run-as-user)

Allows the server to run code with client-side restrictions. Integrates nicely with the security package. See [documentation](https://github.com/DispatchMe/Meteor-run-as-user/) for usage.

### [random](https://atmospherejs.com/meteor/random)

We use it to generate a random id (`Random.id()`) for the initial user. See [documentation](https://atmospherejs.com/meteor/random) for a complete list of features.

### [nimble:restivus](https://atmospherejs.com/nimble/restivus)

A package that makes it easy to create a rest API for usage in Meteor. For usage see [the documentation](https://github.com/kahmali/meteor-restivus/)
