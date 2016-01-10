Mail = new Mailgun({
  apiKey: Meteor.settings.mailgun.apiKey,
  domain: Meteor.settings.mailgun.domain
});
