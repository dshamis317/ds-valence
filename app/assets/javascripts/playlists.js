// ***** MODEL *****

function PlaylistModel (dataObject) {
   this.title = dataObject.title;
   this.mood = dataObject.mood;
   this.user_id = dataObject.user_id;
};


// ***** VIEW *****

function PlaylistView (model) {
   this.model = model;
   this.el = undefined;
};

PlaylistView.prototype.render = function() {
   var ul = $('<ul>');
   var div = $('<div>')
   .addClass('playlistDisplay')
   .html(this.model.title)
   .append(ul);

   this.el = div;
   return this;
};

// ***** COLLECTION *****

function PlaylistCollection () {
   this.playlists = {};
};

PlaylistCollection.prototype.fetch = function() {
   var that = this;
   var $userId = $('.playlist-title').data('userId');
   $.ajax({
      url: '/users/:'+$userId+'/playlists',
      method: 'get',
      dataType: 'json',
      success: function(data) {
         $.each(data, function(i, dataObject) {
            var playlist = new PlaylistModel(dataObject);
            that.playlists[playlist.id] = playlist;
         });
      }
   })
};

PlaylistCollection.prototype.add = function(playlist) {
   var that = this;

   $.ajax({
      url: '/playlists',
      method: 'post',
      dataType: 'json',
      data: {playlist: playlist},
      success: function(data) {
         var playlist = new PlaylistModel(data);
         that.playlists[playlist.id]=playlist;
      }
   })
};

function addSongToPlaylist(song){
  var song = new SongModel();
  Playlist.add(song);
}

function setEventHandlers(){
  $(".add-song").droppable({
    drop: function(e, dropped){
      addSongToPlaylist(dropped.draggable);
    },
    hoverClass: "drop-hover"
  });
  $(Playlist).on('change', function(){
    $('.playlist').empty();
    $.each(this.songs, function(i, song){
      var SongView = new SongView(song);
      $('.playlist').prepend(SongView.render().el);
    });
  })
}

$(function(){
  setEventHandlers();
  SongCollection.fetch();
});