const addressBarParameters = new URLSearchParams(window.location.search);
const albumId = addressBarParameters.get('id');
const albumImage = document.getElementById('albumImage');
const albumTitle = document.getElementById('albumTitle');
const artistImage = document.getElementById('artistImage');
const artistName = document.getElementById('artistName');
const trackList = document.getElementById('trackList');
let albid = '';
let myAlbum;

async function getAlbum(albid) {
  try {
    const response = await fetch(
      'https://striveschool-api.herokuapp.com/api/deezer/album/' + albid
    );
    const data = await response.json();
    myAlbum = data;
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener('load', init());

function init() {
  getAlbum(albumId);
  printTrackList(myAlbum.tracks.data);
  printAlbumDetails();
}

// function printTrackList(tracks) {
// for (let i = 0; i < tracks.length; i++) {
//   console.log(tracks[i]);
// }
// }

