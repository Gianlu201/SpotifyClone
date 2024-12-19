const params = new URLSearchParams(window.location.search);
const artistId = params.get('id');
const nameartist = document.getElementById('nameartist');
const numeroAscolti = document.getElementById('numeroAscolti');
const tracksList = document.getElementById('tracksList');
const artistImg = document.getElementById('artistImg');
const artistDetails = document.getElementById('artistDetails');
const artistName = document.getElementById('artistName');
const showMore = document.getElementById('showMore');
const btnRandomPlay = document.getElementById('randomPlay');

const btnPlay = document.getElementById('btnPlay');
const btnNext = document.getElementById('btnNext');
const myHistory = [];

const URL = 'https://striveschool-api.herokuapp.com/api/deezer/artist/';
let myArtist;
let artistTracks = [];

document.addEventListener('load', init());

btnRandomPlay.addEventListener('click', playRandomTrack);

function init() {
  getArtist('artist', URL, artistId);
  getFromLocalStorage();
}

async function getArtist(str, url, id) {
  try {
    const response = await fetch(url + id);
    const data = await response.json();
    switch (str) {
      case 'artist':
        myArtist = data;
        getArtist('tracks', myArtist.tracklist);
        break;
      case 'tracks':
        artistTracks = data.data;
        loadPage();
    }
  } catch (error) {
    console.log(error);
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

function loadPage() {
  showDetails();
  showTracks();
}

function showDetails() {
  console.log('ciao');

  nameartist.innerText = myArtist.name;
  numeroAscolti.innerText = myArtist.nb_fan;
  artistDetails.style.backgroundImage = `url("${myArtist.picture_xl}")`;
  artistImg.src = myArtist.picture_medium;
  artistName.innerText = myArtist.name;
}

function showTracks() {
  for (let i = 0; i < 30; i++) {
    const newRow = document.createElement('div');
    newRow.classList.add('row', 'p-2');

    const newNum = document.createElement('span');
    newNum.classList.add('col-1');
    newNum.innerText = i + 1;

    const newDiv = document.createElement('a');
    newDiv.href = `album.html?id=${artistTracks[i].album.id}`;
    newDiv.classList.add('col-1');

    const newImg = document.createElement('img');
    newImg.src = artistTracks[i].album.cover_small;
    newImg.setAttribute('width', '35px');

    const newTitle = document.createElement('span');
    newTitle.classList.add('col-5', 'trackTitle');
    newTitle.innerText = artistTracks[i].title_short;
    newTitle.setAttribute(
      'onclick',
      `setPlayer("${artistTracks[i].preview}", "${artistTracks[i].title_short}", "${artistTracks[i].artist.name}", "${artistTracks[i].album.cover_small}")`
    );

    const newHeartDiv = document.createElement('div');
    newHeartDiv.classList.add('col-1');

    const heart = document.createElement('span');
    heart.innerHTML = `<i class="bi bi-heart"></i>`;
    heart.setAttribute(
      'onclick',
      `addLike("${artistTracks[i].title_short}", "${artistTracks[i].artist.name}", "${artistTracks[i].album.title}", "${artistTracks[i].duration}", "${artistTracks[i].rank}", "${artistTracks[i].artist.id}", "${artistTracks[i].album.cover_small}", "${artistTracks[i].album.id}", "${artistTracks[i].preview}", ${i})`
    );

    const newListeners = document.createElement('span');
    newListeners.classList.add('col-2', 'text-secondary', 'text-end');
    newListeners.innerText = artistTracks[i].rank;

    const newTime = document.createElement('span');
    newTime.classList.add('col-2', 'text-secondary', 'text-end');
    newTime.innerText = getTimeFormat(artistTracks[i].duration);

    newDiv.appendChild(newImg);
    newRow.appendChild(newNum);
    newRow.appendChild(newDiv);
    newRow.appendChild(newTitle);
    newHeartDiv.appendChild(heart);
    newRow.appendChild(newHeartDiv);
    newRow.appendChild(newListeners);
    newRow.appendChild(newTime);

    if (i >= 5) {
      newRow.setAttribute('hidden', 'true');
    }

    tracksList.appendChild(newRow);
  }
}

function showMoreTracks() {
  showMore.setAttribute('hidden', 'true');
  showMore.classList.remove('d-block');

  const myTracks = document.querySelectorAll('#tracksList .row');
  myTracks.forEach((element) => {
    element.removeAttribute('hidden');
  });
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
  const myTrack = artistTracks[Math.floor(Math.random() * artistTracks.length)];

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
  document.getElementById('artistName').innerText = artist;
  setPause();

  const myTrack = new Track(link, title, artist, imgUrl);
  myHistory.push(myTrack);
  updateLocalStorage();
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

function getFromLocalStorage() {
  const hist = JSON.parse(localStorage.getItem('history'));

  if (hist) {
    hist.forEach((element) => {
      myHistory.push(element);
    });
  }
}

function updateLocalStorage() {
  localStorage.setItem('history', JSON.stringify(myHistory));
}

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
  index
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

  setFilledHearth(index);

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
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

function setFilledHearth(index) {
  const myRows = document.querySelectorAll('#tracksList .row');
  console.log(myRows[index]);

  // Intercettare il cuore e cambiare la classe in -fill
}
