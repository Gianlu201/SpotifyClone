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
const progressBar = document.getElementById('progressBar');

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

    const newListeners = document.createElement('span');
    newListeners.classList.add('col-3', 'text-secondary', 'text-end');
    newListeners.innerText = artistTracks[i].rank;

    const newTime = document.createElement('span');
    newTime.classList.add('col-2', 'text-secondary', 'text-end');
    newTime.innerText = getTimeFormat(artistTracks[i].duration);

    newDiv.appendChild(newImg);
    newRow.appendChild(newNum);
    newRow.appendChild(newDiv);
    newRow.appendChild(newTitle);
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
  playtime();

  document.getElementById('trackImage').src = imgUrl;
  document.getElementById('trackName').innerText = `${title.slice(0, 16)}...`;
  document.getElementById('nomeArtista').innerHTML = artist;
  setPause();

  const myTrack = new Track(link, title, artist, imgUrl);
  myHistory.push(myTrack);
  updateLocalStorage();
}

btnPlay.addEventListener('click', () => {
  const pause = '<i class="bi bi-pause-fill fs-1"></i>';
  const play = '<i class="bi bi-play-fill fs-1"></i>';
  if (btnPlay.classList.contains('bi-play-fill')) {
    document.getElementById('musicSource').play();
    setPause();
  } else if (btnPlay.classList.contains('bi-pause-fill')) {
    document.getElementById('musicSource').pause();
    setPlay();
  }
});

btnNext.addEventListener('click', playRandomTrack);

function setPlay() {
  btnPlay.classList.remove('bi-pause-fill');
  btnPlay.classList.add('bi-play-fill');
  // btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1"></i>';
}

function setPause() {
  btnPlay.classList.remove('bi-play-fill');
  btnPlay.classList.add('bi-pause-fill');
  // btnPlay.innerHTML = '<i class="bi bi-pause-fill fs-1"></i>';
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



async function playtime() {
  const mywidth = 100 / 29;
  let counter = 0;
  setInterval(() => {
    counter += mywidth;
    progressBar.style.width = counter + '%';
  }, 1000);
}

