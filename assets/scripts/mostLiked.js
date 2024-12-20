const trackList = document.getElementById('trackList');
const playlistCounter = document.getElementById('playlistCounter');
const btnPlayRandom = document.getElementById('playRandom');
const musicSource = document.getElementById('musicSource');
const searchedList = document.getElementById('searchedList');
const myHistory = [];

const URL = 'https://6763e34117ec5852caea54ca.mockapi.io/playlist';
let myTracks = [];

document.addEventListener('load', init());

btnPlayRandom.addEventListener('click', playRandom);

function init() {
  getTracks();
  getFromLocalStorage();
  updateHistoryList();
}

class Track {
  constructor(_preview, _title, _artist, _albumCover) {
    this.preview = _preview;
    this.title = _title;
    this.artist = _artist;
    this.albumCover = _albumCover;
  }
}

function getFromLocalStorage() {
  const hist = JSON.parse(localStorage.getItem('history'));

  if (hist) {
    hist.forEach((element) => {
      myHistory.push(element);
    });
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

async function getTracks() {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    updateTracks(data);
  } catch (error) {
    console.log(error);
  }
}

function updateTracks(data) {
  myTracks = [];
  for (let i = 0; i < data.length; i++) {
    myTracks.push(data[i]);
  }

  showTracks();
}

function showTracks() {
  playlistCounter.innerText = myTracks.length;

  trackList.innerHTML = '';

  for (let i = 0; i < myTracks.length; i++) {
    const newRow = document.createElement('div');
    newRow.classList.add('row', 'mb-3', 'row-hover');

    const newCount = document.createElement('span');
    newCount.classList.add('col-1', 'px-3', 'align-content-center', 'mb-0', 'track-num');
    newCount.innerText = i + 1;

    const newPlayIcon = document.createElement('span');
    newPlayIcon.classList.add('col-1', 'px-3', 'align-content-center', 'mb-0','play-icon');
    newPlayIcon.innerHTML = `<i class="bi bi-play-fill"></i>`;

    const albumDiv = document.createElement('div');
    albumDiv.classList.add('col-10', 'col-lg-5', 'd-flex');

    const newAlbumLink = document.createElement('a');
    newAlbumLink.href = `album.html?id=${myTracks[i].album_id}`;

    const newAlbumImg = document.createElement('img');
    newAlbumImg.src = myTracks[i].album_cover;

    const newDiv = document.createElement('div');

    const newTitle = document.createElement('p');
    newTitle.classList.add('track-title', 'fw-bold', 'm-1');
    newTitle.innerText = myTracks[i].title;
    newTitle.setAttribute(
      'onclick',
      `setPlayer("${myTracks[i].preview}", "${myTracks[i].title}", "${myTracks[i].artist}", "${myTracks[i].album_cover}")`
    );

    const newArtist = document.createElement('a');
    newArtist.classList.add('text-secondary', 'm-1');
    newArtist.innerText = myTracks[i].artist;
    newArtist.href = `artistPage.html?id=${myTracks[i].artist_id}`;

    const newRank = document.createElement('p');
    newRank.classList.add('col-3', 'm-0', 'align-self-center', 'd-none', 'd-lg-block');
    newRank.innerText = myTracks[i].rank;

    const newTime = document.createElement('p');
    newTime.classList.add('col-2', 'pe-4', 'm-0', 'align-self-center', 'd-none', 'd-lg-block');
    newTime.innerText = getTimeFormat(myTracks[i].duration);

    const lastDiv = document.createElement('div');
    lastDiv.classList.add('col-1', 'd-flex', 'align-items-center');

    const heart = document.createElement('span');
    heart.innerHTML = `<i class="bi bi-heart-fill"></i>`;
    heart.setAttribute('onclick', `deleteTrack(${myTracks[i].id})`);

    newRow.appendChild(newCount);
    newRow.appendChild(newPlayIcon);
    newAlbumLink.appendChild(newAlbumImg);
    albumDiv.appendChild(newAlbumLink);
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newArtist);
    albumDiv.appendChild(newDiv);
    newRow.appendChild(albumDiv);
    newRow.appendChild(newRank);
    newRow.appendChild(newTime);
    lastDiv.appendChild(heart);
    newRow.appendChild(lastDiv);

    trackList.appendChild(newRow);
  }
}

function setPlayer(link, title, artist, imgUrl) {
  musicSource.innerHTML = '';
  musicSource.src = link;
  musicSource.setAttribute('autoplay', 'true');

  document.getElementById('trackImage').src = imgUrl;
  document.getElementById('trackName').innerText = `${title.slice(0, 16)}...`;
  document.getElementById('artistName').innerText = artist;

  const myTrack = new Track(link, title, artist, imgUrl);
  myHistory.push(myTrack);
  updateHistory(myTrack);
  updateLocalStorage();
  updateHistoryList();
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

async function deleteTrack(id) {
  try {
    console.log(URL + `/${id}`);
    const response = await fetch(URL + `/${id}`, {
      method: 'DELETE',
    });
    getTracks();
  } catch (error) {
    console.log(error);
  }
}

function playRandom() {
  if (myTracks.length > 0) {
    const randomTrack = myTracks[Math.floor(Math.random() * myTracks.length)];

    setPlayer(
      randomTrack.preview,
      randomTrack.title,
      randomTrack.artist,
      randomTrack.album_cover
    );
  }
}
