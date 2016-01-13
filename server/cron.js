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

SyncedCron.start();
