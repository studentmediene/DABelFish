/* Database schemas */

var Schemas = {}

Schemas.DABText = new SimpleSchema({
  text: {
    type: String,
    label: "Text that will appair on the DAB display",
    optional: false,
    max: 140
  },
  createdBy: {
    type: String,
    label: "ID of the user who created the text",
    optional: false,
  },
  createdAt: {
    type: Date,
    label: "The date and time on wich the text was created",
    optional: false
  },
  startAt: {
    type: Date,
    label: "The date and time on wich the text will appair on the DAB display",
    optional: false
  },
  lastFor: {
    type: Number,
    label: "The number of minutes the text will appair on the DAB display",
    optional: true,
    min: 1,
    max: 60
  }
});

Schemas.User = new SimpleSchema({
  emails: {
    type: Array,
    optional: false
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  name: {
    type: String,
    optional: false,
    max: 140
  }
  admin: {
    type: Boolean,
    optional: false
  },
  createdBy: {
    type: String,
    optional: false
  },
  createdAt: {
    type: Date
  },
  // Keep this, needed by the accounts-password package
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // Keep this to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true
  }
});

DABText.attachSchema(Schemas.DABText);
Meteor.users.attachSchema(Schema.User);
