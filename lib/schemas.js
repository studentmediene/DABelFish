/* Database schemas */

var Schema = {}

Schema.DABText = new SimpleSchema({
  text: {
    type: String,
    label: "Text that will appair on the DAB display",
    optional: false,
    max: 140
  },
  // ID of the user who created the record
  createdByID: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: false
  },
  // Name of the person who created the record
  createdBy: {
    type: String,
    optional: false
  },
  createdAt: {
    type: Date,
    label: "Date and time on wich the text was created",
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  }
});

Schema.UserProfile = new SimpleSchema({
  name: {
    type: String,
    label: "Full name or name of show",
    optional: false
  }
  // Add more userprofile stuff here if needed
});

Schema.User = new SimpleSchema({
  username: {
    type: String,
    label: "Email",
    regEx: SimpleSchema.RegEx.Email,
    optional: false
  },
  roles: {
    type: [String],
    allowedValues: ['user', 'admin', 'disabled'],
    label: "Roles",
    defaultValue: function() {
      return ['user'];
    },
    optional: true,
  },
  profile: {
    type: Schema.UserProfile,
    optional: false
  },
  createdByID: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: false
  },
  createdBy: {
    type: String,
    optional: false
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  // This handles login services (e.g. facbook, google etc)
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // This is needed to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true
  }
});

Meteor.users.attachSchema(Schema.User);
DABText.attachSchema(Schema.DABText);
