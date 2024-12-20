const bigCard = document.getElementById('bigCard');
const suggestsBox = document.getElementById('suggestsBox');
const mostLiked = document.getElementById('mostLiked');
const todayHits = document.getElementById('todayHits');
const mood = document.getElementById('mood');
const goodFeelings = document.getElementById('goodFeelings');
const musicSource = document.getElementById('musicSource');
const searchedList = document.getElementById('searchedList');

const SRC_URL = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=';
const ARTIST_URL = 'https://striveschool-api.herokuapp.com/api/deezer/artist/';
const ALBUM_URL = 'https://striveschool-api.herokuapp.com/api/deezer/album/';
const musicList = [];
const musicList2 = [];
const musicList3 = [];
const musicList4 = [];
const searchList = ['pink floyd', 'qeen', 'eminem', 'coldplay'];
const searchList2 = ['pop', 'rock', 'king', 'something'];
const searchList3 = ['red', 'blue', 'green', 'yellow'];
const searchList4 = ['alone', 'friend', 'sunshine', 'moon'];

const myHistory = [];

// !START
document.addEventListener('load', init());

function init() {
  let mySearch = searchList[Math.floor(Math.random() * searchList.length)];
  searchRequest(SRC_URL, mySearch, musicList);

  mySearch = searchList2[Math.floor(Math.random() * searchList2.length)];
  searchRequest(SRC_URL, mySearch, musicList2);

  mySearch = searchList3[Math.floor(Math.random() * searchList3.length)];
  searchRequest(SRC_URL, mySearch, musicList3);

  mySearch = searchList4[Math.floor(Math.random() * searchList4.length)];
  searchRequest(SRC_URL, mySearch, musicList4);

  getFromLocalStorage();
  updateHistoryList();
}

async function searchRequest(URL, reserchKey, list) {
  try {
    const response = await fetch(URL + reserchKey, {
      'Content-Type': 'application/json; charset= utf-8',
    });
    const data = await response.json();

    for (let i = 0; i < data.data.length; i++) {
      list.push(data.data[i]);
    }

    switch (list) {
      case musicList:
        showPage();
        break;

      case musicList2:
        printList(list, todayHits);
        break;

      case musicList3:
        printList(list, mood);
        break;

      case musicList4:
        printList(list, goodFeelings);
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

class Track {
  constructor(_preview, _title, _artist, _albumCover) {
    this.preview = _preview;
    this.title = _title;
    this.artist = _artist;
    this.albumCover = _albumCover;
  }
}

function showPage() {
  printBigCard(musicList[0]);
  printSuggests(musicList);
  printList(musicList, mostLiked);
}

function printBigCard(element) {
  bigCard.innerHTML = '';

  const newRow = document.createElement('div');
  newRow.classList.add('row', 'g-0');

  const newCol1 = document.createElement('div');
  newCol1.classList.add('col-md-4');

  const newImg = document.createElement('img');
  newImg.src = element.album.cover_medium;
  newImg.classList.add('img', 'rounded-start', 'm-4');

  newCol1.appendChild(newImg);

  const newCol2 = document.createElement('div');
  newCol2.classList.add('col-md-8', 'mt-4');

  const newBody = document.createElement('div');

  const newH4 = document.createElement('h4');
  newH4.classList.add('lead');
  newH4.innerText = element.album.title;

  const newH2 = document.createElement('h2');
  newH2.classList.add('card-title', 'my-2', 'display-2', 'fw-bold');
  newH2.innerText = element.title;

  const newArtist = document.createElement('h5');
  newArtist.innerText = element.artist.name;

  const newParagraph = document.createElement('p');
  newParagraph.classList.add('lead');
  newParagraph.innerText = `Ascolta il nuovo singolo di ${element.artist.name}`;

  const newBtnPlay = document.createElement('button');
  newBtnPlay.type = 'button';
  newBtnPlay.classList.add(
    'btn',
    'btn-success',
    'rounded-5',
    'text-black',
    'me-3',
    'buttonPlayBigCard'
  );
  newBtnPlay.innerText = 'Play';

  newBtnPlay.addEventListener('click', (event) => {
    event.stopPropagation(); // Previene che l'evento si propaghi alla bigCard
    setPlayer(
      element.preview,
      element.title,
      element.artist.name,
      element.album.cover_small
    );
  });

  const newBtnSave = document.createElement('button');
  newBtnSave.type = 'button';
  newBtnSave.classList.add('btn', 'btn-outline-light', 'rounded-5', 'me-3');
  newBtnSave.innerText = 'Salva';

  const newI = document.createElement('i');
  newI.classList.add('bi', 'bi-three-dots');

  newBody.appendChild(newH4);
  newBody.appendChild(newH2);
  newBody.appendChild(newArtist);
  newBody.appendChild(newParagraph);
  newBody.appendChild(newBtnPlay);
  newBody.appendChild(newBtnSave);
  newBody.appendChild(newI);

  newCol2.appendChild(newBody);

  newRow.appendChild(newCol1);
  newRow.appendChild(newCol2);

  bigCard.appendChild(newRow);

  bigCard.addEventListener('click', () => {
    //funzione che permette di cliccare la BIGCARD
    window.location.href = `album.html?id=${element.album.id}`;
  });
}

// TODO Aggiungere spazio tra le carte
function printSuggests(list) {
  suggestsBox.innerHTML = '';
  const collageTitles = [
    'Top Hits 2024',
    'Be The Young',
    'Brani del momento',
    'I più ascoltati',
    'Suggeriti per te',
  ];

  for (let i = 0; i < 6; i++) {
    const newCol = document.createElement('div');
    newCol.classList.add(
      'col-sm-6',
      'col-lg-4',
      'd-flex',
      'align-items-center',
      'position-relative',
      'mb-3',
      'cardMini'
    );

    const newDiv = document.createElement('div');
    newDiv.classList.add('me-2');

    const newTitle = document.createElement('h6');

    if (i % 2 != 0) {
      newDiv.classList.add('collage');
      for (let j = 0; j < 4; j++) {
        const newImg = document.createElement('img');
        newImg.src = `assets/imgs/main/image-${10 + i + j}.jpg`;
        newDiv.appendChild(newImg);
        newTitle.innerText =
          collageTitles[Math.floor(Math.random() * collageTitles.length)];
      }
    } else {
      const newImg = document.createElement('img');
      newImg.src = list[i + 1].album.cover_small;
      newDiv.appendChild(newImg);
      newTitle.innerText = list[i + 1].album.title;
    }

    // btn Play
    const playButton = document.createElement('button');
    playButton.classList.add('btn', 'btn-success', 'play-button');
    playButton.innerHTML = `<i class="bi bi-play-fill"></i>`;
    playButton.setAttribute(
      'onclick',
      `setPlayer("${list[i + 7].preview}", "${list[i + 7].title}", "${
        list[i + 7].artist.name
      }", "${list[i + 7].album.cover_small}")`
    );

    newCol.appendChild(newDiv);
    newCol.appendChild(newTitle);
    newCol.appendChild(playButton);

    suggestsBox.appendChild(newCol);
  }
}

// RESPONSIVE
// function adjustColumnWidth() {
//   const newCols = document.querySelectorAll('.cardMini');
//   newCols.forEach((newCol) => {
//     if (window.innerWidth >= 992) {
//       newCol.style.width = 'calc(33.333% - 20px)';
//     } else if (window.innerWidth >= 576) {
//       newCol.style.width = 'calc(50% - 20px)';
//     } else {
//       newCol.style.width = 'calc(100% - 20px)';
//     }
//   });
// }

// window.addEventListener('load', adjustColumnWidth);
// window.addEventListener('resize', adjustColumnWidth);

function printList(list, target) {
  target.innerHTML = '';

  for (let i = 0; i < 6; i++) {
    const newCard = document.createElement('div');
    newCard.classList.add('card', 'secondCard', 'position-relative');

    if (i >= 3) {
      newCard.classList.add('hide-mobile');
    }

    const newAImg = document.createElement('a');
    newAImg.href = `album.html?id=${list[i + 8].album.id}`;

    const newImg = document.createElement('img');
    newImg.src = list[i + 8].album.cover_medium;
    newImg.classList.add('card-img-top');

    const newBody = document.createElement('div');
    newBody.classList.add('card-body');

    const newTitle = document.createElement('p');
    newTitle.classList.add('cart-title', 'fs-6');
    newTitle.innerText = list[i + 8].title;

    newTitle.classList.add('cart-title', 'fs-6');

    const newAArtist = document.createElement('a');
    newAArtist.href = `artistPage.html?id=${list[i + 8].artist.id}`;

    const newP = document.createElement('p');
    newP.classList.add('card-text');
    newP.innerText = list[i + 8].artist.name;

    // btn Play
    const playButton = document.createElement('button');
    playButton.classList.add('btn', 'btn-success', 'play2-button');
    playButton.innerHTML = `<i class="bi bi-play-fill"></i>`; // Icona di play
    playButton.setAttribute(
      'onclick',
      `setPlayer("${list[i + 8].preview}", "${list[i + 8].title}", "${
        list[i + 8].artist.name
      }", "${list[i + 8].album.cover_small}")`
    );

    newAImg.appendChild(newImg);
    newCard.appendChild(newAImg);
    newBody.appendChild(newTitle);
    newAArtist.appendChild(newP);
    newBody.appendChild(newAArtist);
    newCard.appendChild(newBody);

    newCard.appendChild(playButton);

    target.appendChild(newCard);
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

function getFromLocalStorage() {
  const hist = JSON.parse(localStorage.getItem('history'));

  if (hist) {
    hist.forEach((element) => {
      myHistory.push(element);
    });
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
