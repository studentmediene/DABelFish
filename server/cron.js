
SyncedCron.add({
  name: 'Update DAB text with current show',

  schedule: function(parser) {
    return parser.cron('30 0 * * * *', true); // thirty seconds past every hour
  },
  job: function() {
    var setDefaultText = resetDabText();
    return setDefaultText;
  }
});

SyncedCron.add({
  name: "Check if text has to be reset",

  schedule: function(parser) {
    return parser.text("every 1 minute");
  },
  job: function() {
    var checkReset = setAutomaticShowAndSongs();
    return checkReset;
  }
});

SyncedCron.start();
// if (!Meteor.settings.DEBUG){
// }
