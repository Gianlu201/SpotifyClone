const colorThief = new ColorThief();
const background = document.getElementById('background');

const params = new URLSearchParams(window.location.search);
const albumId = params.get('id');
const albumImage = document.getElementById('albumImage');
const albumTitle = document.getElementById('albumTitle');
const albumArtist = document.getElementById('albumArtist');
const albumArtistImage = document.getElementById('albumArtistImage');
const artistLink = document.getElementById('artistLink');
const trackList = document.getElementById('trackList');
const musicSource = document.getElementById('musicSource');
const searchedList = document.getElementById('searchedList');
const URL = 'https://striveschool-api.herokuapp.com/api/deezer/album/';
let myAlbum;
const btnRandomPlay = document.getElementById('randomPlay');

const btnPlay = document.getElementById('btnPlay');
const btnNext = document.getElementById('btnNext');
let myFavTracks = [];

const myHistory = [];

document.addEventListener('load', init());

btnRandomPlay.addEventListener('click', playRandomTrack);

function init() {
  getMyFav();
  getAlbum(albumId);
  getFromLocalStorage();
  updateHistoryList();
}

function getFromLocalStorage() {
  const hist = JSON.parse(localStorage.getItem('history'));

  if (hist) {
    hist.forEach((element) => {
      myHistory.push(element);
    });
  }
}

class FavTrack {
  constructor(
    _title,
    _artist,
    _album,
    _duration,
    _rank,
    _artist_id,
    _album_cover,
    _album_id,
    _preview
  ) {
    this.title = _title;
    this.artist = _artist;
    this.album = _album;
    this.duration = _duration;
    this.rank = _rank;
    this.artist_id = _artist_id;
    this.album_cover = _album_cover;
    this.album_id = _album_id;
    this.preview = _preview;
  }
}

function updateHistoryList() {
  searchedList.innerHTML = '';

  for (let i = 0; i < myHistory.length; i++) {
    const newLi = document.createElement('li');
    newLi.innerText = myHistory[i].title;
    newLi.setAttribute(
      'onclick',
      `setPlayer("${myHistory[i].preview}", "${myHistory[i].title}", "${myHistory[i].artist}", "${myHistory[i].albumCover}")`
    );

    searchedList.prepend(newLi);
  }
}

function updateHistory(obj) {
  const myObj = { ...obj };
  for (let i = 0; i < myHistory.length - 1; i++) {
    if (
      myHistory[i].preview === myObj.preview &&
      myHistory[i].title === myObj.title &&
      myHistory[i].artist === myObj.artist &&
      myHistory[i].albumCover === myObj.albumCover
    ) {
      myHistory.splice(i, 1);
    }
  }

  if (myHistory.length > 30) {
    myHistory.shift();
  }
}

function updateLocalStorage() {
  localStorage.setItem('history', JSON.stringify(myHistory));
}

async function getAlbum(id) {
  try {
    const response = await fetch(URL + id);
    const data = await response.json();
    myAlbum = data;
    printPage();
  } catch (error) {
    console.log(error);
  }
}

async function getMyFav() {
  try {
    const response = await fetch(
      'https://6763e34117ec5852caea54ca.mockapi.io/playlist'
    );
    const data = await response.json();
    myFavTracks = data;
    console.log(myFavTracks);
  } catch (error) {
    console.log(error);
  }
}

function printPage() {
  printAlbumDetails();
  printTracks(myAlbum.tracks.data);
  setTimeout(() => {
    setBackgroundColor();
  }, 50);
}

function printAlbumDetails() {
  albumImage.src = myAlbum.cover_medium;
  albumTitle.innerText = myAlbum.title;
  albumArtist.innerText = myAlbum.artist.name;
  albumArtistImage.src = myAlbum.artist.picture_small;
  artistLink.href = `http://127.0.0.1:5500/artistPage.html?id=${myAlbum.artist.id}`;
}

async function setBackgroundColor() {
  let color;
  let linearGradient;

  try {
    const img = document.getElementById('albumImage');
    const dominantRGB = await colorThief.getColor(img);
    // console.log(dominantRGB['0']);
    // console.log(dominantRGB['1']);
    // console.log(dominantRGB['2']);
    // console.log(rgbToHex(dominantRGB[0], dominantRGB[1], dominantRGB[2]));

    color = rgbToHex(dominantRGB['0'], dominantRGB['1'], dominantRGB['2']);

    linearGradient = 'linear-gradient(' + color + ' 3%,#181818)';

    background.style.background = linearGradient;

    return;
  } catch (error) {
    console.log(error);
  }
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function printTracks(tracks) {
  trackList.innerHTML = '';
  let taken;
  for (let i = 0; i < tracks.length; i++) {
    taken = false;
    let myId;
    myFavTracks.forEach((track) => {
      if (
        track.title == tracks[i].title_short &&
        track.artist_id == tracks[i].artist.id &&
        track.album_id == tracks[i].album.id
      ) {
        taken = true;
        myId = track.id;
      }
    });

    const newRow = document.createElement('div');
    newRow.classList.add('row', 'row-hover');
    newRow.setAttribute(
      'onclick',
      `setPlayer("${tracks[i].preview}", "${tracks[i].title}", "${tracks[i].artist.name}", "${tracks[i].album.cover_small}")`
    );

    const newParagraph = document.createElement('p');
    newParagraph.classList.add(
      'px-3',
      'col-1',
      'align-content-center',
      'mb-0',
      'numberLine',
      'track-num'
    );
    newParagraph.innerText = i + 1;
    // icona play
    const newPlayIcon = document.createElement('span');
    newPlayIcon.classList.add(
      'col-1',
      'px-3',
      'align-content-center',
      'mb-0',
      'play-icon'
    );
    newPlayIcon.innerHTML = `<i class="bi bi-play-fill"></i>`;

    const newDiv = document.createElement('div');
    newDiv.classList.add('col-10', 'col-md-6');

    const newTitle = document.createElement('p');
    newTitle.classList.add('m-1', 'fw-bold', 'titleSong');
    newTitle.innerText = tracks[i].title;

    const newArtist = document.createElement('a');
    newArtist.classList.add('m-0', 'text-secondary');
    newArtist.innerText = tracks[i].artist.name;
    newArtist.href = `artistPage.html?id=${tracks[i].artist.id}`;

    const newRank = document.createElement('p');
    newRank.classList.add('col-3', 'numberVisual');
    newRank.innerText = tracks[i].rank;

    const newTime = document.createElement('p');
    newTime.classList.add('col-1', 'pe-4', 'numberTime');
    newTime.innerText = getTimeFormat(tracks[i].duration);

    const newHeartDiv = document.createElement('div');
    newHeartDiv.classList.add('col-1', 'heartDiv');

    const heart = document.createElement('span');
    if (taken) {
      heart.innerHTML = `<i class="bi bi-heart-fill text-success"></i>`;
      heart.setAttribute(
        'onclick',
        `removeLike("${tracks[i].title_short}", "${tracks[i].artist.name}", "${tracks[i].album.title}", "${tracks[i].duration}", "${tracks[i].rank}", "${tracks[i].artist.id}", "${tracks[i].album.cover_small}", "${tracks[i].album.id}", "${tracks[i].preview}", ${i}, "${myId}")`
      );
    } else {
      heart.innerHTML = `<i class="bi bi-heart"></i>`;
      heart.setAttribute(
        'onclick',
        `addLike("${tracks[i].title_short}", "${tracks[i].artist.name}", "${tracks[i].album.title}", "${tracks[i].duration}", "${tracks[i].rank}", "${tracks[i].artist.id}", "${tracks[i].album.cover_small}", "${tracks[i].album.id}", "${tracks[i].preview}", ${i}, "${myId}")`
      );
    }

    newRow.appendChild(newParagraph);
    newRow.appendChild(newPlayIcon);
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newArtist);
    newRow.appendChild(newDiv);
    newRow.appendChild(newRank);
    newRow.appendChild(newTime);
    newHeartDiv.appendChild(heart);
    newRow.appendChild(newHeartDiv);

    trackList.appendChild(newRow);
  }
}

function getTimeFormat(val) {
  let min = 0;
  let sec;

  if (val > 60) {
    min = Math.floor(val / 60);
  }

  sec = val - min * 60;
  if (sec < 10) {
    sec = '0' + sec;
  }

  return `${min}:${sec}`;
}

function playRandomTrack() {
  const myTrack =
    myAlbum.tracks.data[Math.floor(Math.random() * myAlbum.tracks.data.length)];

  setPlayer(
    myTrack.preview,
    myTrack.title_short,
    myTrack.artist.name,
    myTrack.album.cover_small
  );
}

class Track {
  constructor(_preview, _title, _artist, _albumCover) {
    this.preview = _preview;
    this.title = _title;
    this.artist = _artist;
    this.albumCover = _albumCover;
  }
}

function setPlayer(link, title, artist, imgUrl) {
  musicSource.innerHTML = '';
  musicSource.src = link;
  musicSource.setAttribute('autoplay', 'true');

  document.getElementById('trackImage').src = imgUrl;
  document.getElementById('trackName').innerText = `${title.slice(0, 16)}...`;
  document.getElementById('nomeArtista').innerHTML = artist;
  setPause();

  const myTrack = new Track(link, title, artist, imgUrl);
  myHistory.push(myTrack);
  updateHistory(myTrack);
  updateLocalStorage();
  updateHistoryList();
}

btnPlay.addEventListener('click', () => {
  const pause = '<i class="bi bi-pause-fill fs-1"></i>';
  const play = '<i class="bi bi-play-fill fs-1"></i>';
  if (btnPlay.innerHTML == play) {
    document.getElementById('musicSource').play();
    setPause();
  } else if (btnPlay.innerHTML == pause) {
    document.getElementById('musicSource').pause();
    setPlay();
  }
});

btnNext.addEventListener('click', playRandomTrack);

function setPlay() {
  btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1"></i>';
}

function setPause() {
  btnPlay.innerHTML = '<i class="bi bi-pause-fill fs-1"></i>';
}

// 10 parametri
function addLike(
  title,
  artist,
  album,
  duration,
  rank,
  artistId,
  albumCover,
  albumId,
  preview,
  index,
  id
) {
  const myDuration = parseInt(duration);
  const myRank = parseInt(rank);
  const myArtistId = parseInt(artistId);
  const myAlbumId = parseInt(albumId);

  const myFavTrack = new FavTrack(
    title,
    artist,
    album,
    myDuration,
    myRank,
    myArtistId,
    albumCover,
    myAlbumId,
    preview
  );

  setFilledHearth(
    title,
    artist,
    album,
    duration,
    rank,
    artistId,
    albumCover,
    albumId,
    preview,
    index,
    id
  );

  addToLiked(myFavTrack);
}

async function addToLiked(obj) {
  try {
    const response = await fetch(
      'https://6763e34117ec5852caea54ca.mockapi.io/playlist',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset= UTF-8',
        },
        body: JSON.stringify(obj),
      }
    );
    const data = await response.json();
  } catch (error) {
    console.log(error);
  }
}

function setFilledHearth(
  title,
  artist,
  album,
  duration,
  rank,
  artistId,
  albumCover,
  albumId,
  preview,
  index,
  id
) {
  const myRow = document.querySelector(
    `#trackList .row:nth-of-type(${index + 1}) .heartDiv span i`
  );
  myRow.classList.remove('bi-heart');
  myRow.classList.add('bi-heart-fill', 'text-success');
  myRow.parentElement.setAttribute(
    'onclick',
    `removeLike("${title}", "${artist}", "${album}", "${duration}", "${rank}", "${artistId}", "${albumCover}", "${albumId}", "${preview}", ${index}, ${id})`
  );
}

function setEmptyHearth(
  title,
  artist,
  album,
  duration,
  rank,
  artistId,
  albumCover,
  albumId,
  preview,
  index,
  id
) {
  const myRow = document.querySelector(
    `#tracksList .row:nth-of-type(${index + 1}) div span i`
  );
  myRow.classList.remove('bi-heart-fill', 'text-success');
  myRow.classList.add('bi-heart');
  myRow.parentElement.setAttribute(
    'onclick',
    `addLike("${title}", "${artist}", "${album}", "${duration}", "${rank}", "${artistId}", "${albumCover}", "${albumId}", "${preview}", ${index})`
  );
}

// 11 parametri
async function removeLike(
  title,
  artist,
  album,
  duration,
  rank,
  artistId,
  albumCover,
  albumId,
  preview,
  index,
  id
) {
  console.log(id);
  try {
    const response = await fetch(
      'https://6763e34117ec5852caea54ca.mockapi.io/playlist/' + id,
      {
        method: 'DELETE',
      }
    );
    setEmptyHearth(
      title,
      artist,
      album,
      duration,
      rank,
      artistId,
      albumCover,
      albumId,
      preview,
      index,
      id
    );
  } catch (error) {
    console.log(error);
  }
}
