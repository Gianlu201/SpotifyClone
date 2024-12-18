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
    console.log(data);
    displayResults(data.data);
  } catch (error) {
    console.log(error);
  }
}

btnSearch.addEventListener('click', load);

function load() {
  filteredSearch();
}

function displayResults(tracks) {
  resultContainer.innerHTML = '';

  tracks.forEach((track) => {
    const trackCard = document.createElement('div');
    trackCard.classList.add('col');

    trackCard.innerHTML = `
        <div class="card shadow-sm custom-card">
          <img src="${track.album.cover_big}" class="card-img-fluid" alt="${track.album.title}">
          <div class="card-body">
            <h5 class="card-title">${track.title}</h5>
            <p class="card-text">${track.artist.name}</p>
          </div>
        </div>
      `;

    resultContainer.appendChild(trackCard);
  });
  titleSfoglia.style.display = 'none';
  sectionSfoglia.style.display = 'none';
}


