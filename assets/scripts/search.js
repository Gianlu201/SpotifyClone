const btnSearch = document.getElementById('btnSearch');
const resultContainer = document.getElementById('resultContainer');
const titleSfoglia = document.getElementById('titleSfoglia');
const sectionSfoglia = document.getElementById('sectionSfoglia');

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
    trackCard.classList.add('card', 'shadow-sm', 'custom-card');

    const newAlbumLink = document.createElement('a');
    newAlbumLink.href = `album.html?id=${track.album.id}`;

    const newImg = document.createElement('img');
    newImg.src = track.album.cover_big;
    newImg.classList.add('card-img-fluid', 'me-2');
    newImg.alt = track.album.title;

    const newBody = document.createElement('div');
    newBody.classList.add('card-body');

    const newTitle = document.createElement('h5');
    newTitle.classList.add('card-title');
    newTitle.innerText = track.title;
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
}
