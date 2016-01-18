
SyncedCron.add({
  name: 'Update DAB text with current show',

  schedule: function(parser) {
    return parser.cron('30 0 7-23 * * *', true); // thirty seconds past every hour
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
    var checkReset = checkResetDabText();
    return checkReset;
  }
});

SyncedCron.add({
  name: 'Update DAB with name of song and artist at night',

  schedule: function(parser) {
    return parser.cron('0/10 * 0-7 * * *', true); // every tenth second
  },
  job: function() {
    var a = Meteor.http.call("GET", "http://streamer.radiorevolt.no:8000/status-json.xsl");
    if(a.data.icestats) {
      a.data.icestats.source.forEach(function(s) {
        try {
          if(s.listenurl == "http://streamer.radiorevolt.no:8000/revolt") {
            if(s.title != "Unknown") {
              title = s.title.substr(0,140);
              var currentText = DABText.findOne({}, {
                sort: {createdAt: -1}
              }).text;
              if(title != currentText) {
                DABText.insert({
                  text: title,
                  createdBy: "GLaDOS",
                  createdByID: Random.id()
                });
                sendDABTextFTP();
              }
            }
          }
        } catch(e) {}
      });
    }
  }
});

SyncedCron.start();
