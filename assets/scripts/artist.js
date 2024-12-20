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
const musicSource = document.getElementById('musicSource');
const searchedList = document.getElementById('searchedList');

const btnPlay = document.getElementById('btnPlay');
const btnNext = document.getElementById('btnNext');
const myHistory = [];

const URL = 'https://striveschool-api.herokuapp.com/api/deezer/artist/';
let myArtist;
let artistTracks = [];
let myFavTracks = [];

document.addEventListener('load', init());

btnRandomPlay.addEventListener('click', playRandomTrack);

function init() {
  getMyFav();
  getArtist('artist', URL, artistId);
  getFromLocalStorage();
  updateHistoryList();
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
  nameartist.innerText = myArtist.name;
  numeroAscolti.innerText = myArtist.nb_fan;
  artistDetails.style.backgroundImage = `url("${myArtist.picture_xl}")`;
  artistImg.src = myArtist.picture_medium;
  artistName.innerText = myArtist.name;
}

function showTracks() {
  let taken;

  for (let i = 0; i < 30; i++) {
    taken = false;
    let myId;
    myFavTracks.forEach((track) => {
      if (
        track.title == artistTracks[i].title_short &&
        track.artist_id == artistTracks[i].artist.id &&
        track.album_id == artistTracks[i].album.id
      ) {
        taken = true;
        myId = track.id;
      }
    });

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
    if (taken) {
      heart.innerHTML = `<i class="bi bi-heart-fill text-success"></i>`;
      heart.setAttribute(
        'onclick',
        `removeLike("${artistTracks[i].title_short}", "${artistTracks[i].artist.name}", "${artistTracks[i].album.title}", "${artistTracks[i].duration}", "${artistTracks[i].rank}", "${artistTracks[i].artist.id}", "${artistTracks[i].album.cover_small}", "${artistTracks[i].album.id}", "${artistTracks[i].preview}", ${i}, ${myId})`
      );
    } else {
      heart.innerHTML = `<i class="bi bi-heart"></i>`;
      heart.setAttribute(
        'onclick',
        `addLike("${artistTracks[i].title_short}", "${artistTracks[i].artist.name}", "${artistTracks[i].album.title}", "${artistTracks[i].duration}", "${artistTracks[i].rank}", "${artistTracks[i].artist.id}", "${artistTracks[i].album.cover_small}", "${artistTracks[i].album.id}", "${artistTracks[i].preview}", ${i}, ${myId})`
      );
    }

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
    `#tracksList .row:nth-of-type(${index + 1}) div span i`
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
