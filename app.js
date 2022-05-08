require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

  
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:


// Our routes go here:
app.get("/", (req, res) => {
  res.render("home.hbs")
});

app.get("/artist-search", (req,res) => {
  //console.log(req.query.artistName);
  spotifyApi.searchArtists(req.query.artistName)
  .then(data => {
    //console.log('The received data from the API: ', data.body.artists.items.images);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
     res.render("artist-search-results.hbs", {
       artistList: data.body.artists.items
     })

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistId", (req,res) => {
  const { artistId } = req.params;

  spotifyApi.getArtistAlbums(artistId)
  .then(
    function(data) {
      //console.log('Artist albums', data.body.items);
      res.render("albums.hbs", {
        albumList: data.body.items
      })
    },
    function(err) {
      console.error(err);
    }
  );
})

app.get("/tracks/:albumId", (req,res) => {

  const { albumId } = req.params;

  spotifyApi.getAlbumTracks(albumId)
  .then(function(data) {
    //console.log(data.body.items);
    res.render("tracklist.hbs", {
      trackList: data.body.items
    })
  }, function(err) {
    console.log('Something went wrong!', err);
  });


})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
