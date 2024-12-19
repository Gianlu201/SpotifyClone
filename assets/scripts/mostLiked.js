const trackList = document.getElementById('trackList');

const URL = 'https://6763e34117ec5852caea54ca.mockapi.io/playlist';
const myTracks = [];

document.addEventListener('load', init());

function init() {
  getTracks();
}

async function getTracks() {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    if (data.length > 0) {
      updateTracks(data);
    }
  } catch (error) {
    console.log(error);
  }
}

function updateTracks(data) {
  for (let i = 0; i < data.length; i++) {
    myTracks.push(data[i]);
  }

  showTracks();
}

function showTracks() {
  trackList.innerHTML = '';

  for (let i = 0; i < myTracks.length; i++) {
    const newRow = document.createElement('div');
    newRow.classList.add('row', 'mb-3');

    const newCount = document.createElement('p');
    newCount.classList.add('col-1', 'px-3', 'align-content-center', 'mb-0');
    newCount.innerText = i + 1;

    const albumDiv = document.createElement('div');
    albumDiv.classList.add('col-5', 'd-flex');

    const newAlbumLink = document.createElement('a');
    newAlbumLink.href = `album.html?id=${myTracks[i].album_id}`;

    const newAlbumImg = document.createElement('img');
    newAlbumImg.src = myTracks[i].album_cover;

    const newDiv = document.createElement('div');

    const newTitle = document.createElement('p');
    newTitle.classList.add('fw-bold', 'm-1');
    newTitle.innerText = myTracks[i].title;

    const newArtist = document.createElement('a');
    newArtist.classList.add('text-secondary', 'm-0');
    newArtist.innerText = myTracks[i].artist;
    newArtist.href = `artistPage.html?id=${myTracks[i].artist_id}`;

    const newRank = document.createElement('p');
    newRank.classList.add('col-3');
    newRank.innerText = myTracks[i].rank;

    const newTime = document.createElement('p');
    newTime.classList.add('col-2', 'pe-4');
    newTime.innerText = myTracks[i].duration;

    const lastDiv = document.createElement('div');
    lastDiv.classList.add('col-1');

    const heart = document.createElement('span');
    heart.innerHTML = `<i class="bi bi-heart-fill"></i>`;

    newRow.appendChild(newCount);
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
