const btnSearch = document.getElementById('btnSearch');
const resultContainer = document.getElementById('resultContainer');
const titleSfoglia = document.getElementById('titleSfoglia');
const sectionSfoglia = document.getElementById('sectionSfoglia');
const musicSource = document.getElementById('musicSource');
const searchedList = document.getElementById('searchedList');
const myHistory = [];

document.addEventListener('load', init());

function init() {
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

function filteredSearch() {
  const query = document.getElementById('searchInput').value;
  const filter = document.getElementById('filterOption').value;
  if (!query) {
    alert('Inserisci un filtro di ricerca');
    return;
  } else {
    search(query);
  }

  console.log(`ricerca: ${query}, filtro: ${filter}`);
}

const baseUrl = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=';
let endpoint;

async function search(q) {
  try {
    const response = await fetch(baseUrl + q);
    const data = await response.json();
    if (data.data[0] == undefined) {
      noMatch();
    } else {
      filterTracks(data.data);
    }
  } catch (error) {
    console.log(error);
  }
}

btnSearch.addEventListener('click', load);

function load() {
  filteredSearch();
}

function filterTracks(tracks) {
  let myFilter = document.getElementById('filterOption').value;
  const myTracks = [];

  switch (myFilter) {
    case 'all':
      tracks.forEach((track) => myTracks.push(track));
      break;
    case 'artist':
      tracks.forEach((track) => {
        let key = track.artist.name
          .toLowerCase()
          .indexOf(document.getElementById('searchInput').value);

        if (key >= 0) {
          myTracks.push(track);
        }
      });
      break;
    case 'album':
      tracks.forEach((track) => {
        let key = track.album.title
          .toLowerCase()
          .indexOf(document.getElementById('searchInput').value);

        if (key >= 0) {
          myTracks.push(track);
        }
      });
      break;
    case 'track':
      tracks.forEach((track) => {
        let key = track.title
          .toLowerCase()
          .indexOf(document.getElementById('searchInput').value);

        if (key >= 0) {
          myTracks.push(track);
        }
      });
      break;
  }

  displayResults(myTracks);
}

function getSuitableTitle(title, titleShort, maxLength = 20) {
  // Se il titolo è più lungo del limite massimo, usa il titolo abbreviato
  return title.length > maxLength ? titleShort : title;
}

function displayResults(tracks) {
  resultContainer.innerHTML = '';
  titleSfoglia.style.display = 'none';
  sectionSfoglia.style.display = 'none';

  tracks.forEach((track) => {
    // const trackCard = document.createElement('div');
    // trackCard.classList.add('col');

    // trackCard.innerHTML = `
    //       <div class="card shadow-sm custom-card">
    //       <a href="album.html?id=${track.album.id}">
    //       <img src="${track.album.cover_big}" class="card-img-fluid" alt="${track.album.title}">
    //       </a>
    //         <div class="card-body">
    //           <h5 class="card-title" onclick="setPlayer("${track.preview}", "${track.title}", "${track.artist.name}", "${track.album.cover_small}")">${track.title}</h5>
    //           <a href="artistPage.html?id=${track.artist.id}">
    //           <p class="card-text">${track.artist.name}</p>
    //           </a>
    //         </div>
    //       </div>
    //     `;

    const trackCard = document.createElement('div');
    trackCard.classList.add(
      'col-12',
      'col-sm-6',
      'col-md-6',
      'card',
      'shadow-sm',
      'category-card',
      'abc'
    );

    const newAlbumLink = document.createElement('a');
    newAlbumLink.href = `album.html?id=${track.album.id}`;

    const newImg = document.createElement('img');
    newImg.src = track.album.cover_big;
    newImg.classList.add('card-img-fluid', 'me-2');
    newImg.alt = track.album.title;

    const newBody = document.createElement('div');
    newBody.classList.add('card-body');

    const suitableTitle = getSuitableTitle(track.title, track.title_short);

    const newTitle = document.createElement('h5');
    newTitle.classList.add('card-title');
    newTitle.innerText = suitableTitle;
    newTitle.setAttribute(
      'onclick',
      `setPlayer("${track.preview}", "${track.title}", "${track.artist.name}", "${track.album.cover_small}")`
    );

    const newArtistLink = document.createElement('a');
    newArtistLink.href = `artistPage.html?id=${track.artist.id}`;

    const newArtist = document.createElement('p');
    newArtist.innerText = track.artist.name;

    newAlbumLink.appendChild(newImg);
    trackCard.appendChild(newAlbumLink);
    newBody.appendChild(newTitle);
    newArtistLink.appendChild(newArtist);
    newBody.appendChild(newArtistLink);
    trackCard.appendChild(newBody);

    resultContainer.appendChild(trackCard);
  });
  adjustTitleFontSize();
}

function noMatch() {
  resultContainer.innerHTML = '';
  titleSfoglia.style.display = 'none';
  sectionSfoglia.style.display = 'none';

  const p = document.createElement('p');
  p.innerText = 'Nessun risultato corrispondente';
  p.classList.add('lead');

  resultContainer.appendChild(p);
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
