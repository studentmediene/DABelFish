sendDABTextFTP = function() {
  if (Meteor.settings.DEBUG) {
    return;
  }
  var FTP = Meteor.npmRequire('ftp');

  var text = DABText.findOne({}, {
    sort: {createdAt: -1}
  });

  var buffer = new Buffer(text.text);

  var c = new FTP();

  c.on('ready', function() {
    c.put(buffer, 'messages/messages.txt', function(err) {
      if (err) throw err;
      c.end();
    });
  });

  c.connect({
    host: Meteor.settings.ftp.host,
    user: Meteor.settings.ftp.user,
    password: Meteor.settings.ftp.password
  });
}
