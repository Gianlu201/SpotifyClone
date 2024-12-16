const SRC_URL = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=';
const ARTIST_URL = 'https://striveschool-api.herokuapp.com/api/deezer/artist/';
const ALBUM_URL = 'https://striveschool-api.herokuapp.com/api/deezer/album/';

async function searchRequest(URL, reserchKey) {
  try {
    const response = await fetch(URL + reserchKey, {
      'Content-Type': 'application/json; charset= utf-8',
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

searchRequest(SRC_URL, 'emimen');
