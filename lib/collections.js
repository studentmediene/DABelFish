/* Collections */

DABText = new Mongo.Collection("dabText");

DABText.allow({
  insert: function(){
    return false;
  },
  update: function(){
    return false;
  },
  remove: function(){
    return false;
  }
});
