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

//player

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audio");
  const playPauseBtn = document.getElementById("play-pause");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const progressBar = document.querySelector(".progress-bar");
  const progressBarFilled = document.querySelector(".progress-bar-filled");

  let isPlaying = false;
  let currentTrackIndex = 0;

  const tracks = [
    "https://cdnt-preview.dzcdn.net/api/1/1/f/2/d/0/f2dd01104dd5eddd844c242c04ff337d.mp3?hdnea=exp=1734387921~acl=/api/1/1/f/2/d/0/f2dd01104dd5eddd844c242c04ff337d.mp3*~data=user_id=0,application_id=42~hmac=cc6f70cb8d869219ad1ddb209b873a09eb58d868a9aa0163b95b3f032d2d8b86",
  ];

  //pulsanti
  const togglePlayPause = () => {
    if (isPlaying) {
      audio.pause();
      playPauseBtn.innerHTML = "&#9654;"; // Play
    } else {
      audio.play();
      playPauseBtn.innerHTML = "&#10073;&#10073;"; // Pausa
    }
    isPlaying = !isPlaying;
  };

  // barra di progresso
  audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBarFilled.style.width = `${progress}%`;
  });

  // Salta in un punto della traccia cliccando sulla barra
  progressBar.addEventListener("click", (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * audio.duration;
    audio.currentTime = newTime;
  });





searchRequest(SRC_URL, 'emimen');
