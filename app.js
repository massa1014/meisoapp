const song = document.querySelector(".song");
const play = document.querySelector(".play");
const replay = document.querySelector(".replay");
const outline = document.querySelector(".moving-outline circle");
const video = document.querySelector(".vid-container video");
//Sounds
const sounds = document.querySelectorAll(".sound-picker button");
//Time Display
const timeDisplay = document.querySelector(".time-display");
const outlineLength = outline.getTotalLength();
//Duration
const timeSelect = document.querySelectorAll(".time-select button");
let fakeDuration = 600;
let timeLeft = fakeDuration; // 残り時間を追跡する変数

outline.style.strokeDashoffset = outlineLength;
outline.style.strokeDasharray = outlineLength;
updateTimeDisplay(); // 初期表示

sounds.forEach(sound => {
  sound.addEventListener("click", function() {
    song.src = this.getAttribute("data-sound");
    video.src = this.getAttribute("data-video");
    checkPlaying(song);
  });
});

play.addEventListener("click", function() {
  checkPlaying(song);
});

replay.addEventListener("click", function() {
    restartSong(song);
    
  });

const restartSong = song =>{
    let currentTime = song.currentTime;
    song.currentTime = 0;
    timeLeft = fakeDuration; // 残り時間もリセット
    updateTimeDisplay();
    checkPlaying(song); // 再生状態を維持
}

timeSelect.forEach(option => {
  option.addEventListener("click", function() {
    fakeDuration = parseInt(this.getAttribute("data-time"));
    timeLeft = fakeDuration; // 初期化
    updateTimeDisplay();
  });
});

const checkPlaying = song => {
  if (song.paused) {
    song.play();
    video.play();
    play.src = "./svg/pause.svg";
    startTimer(); // 再生開始時にタイマーを開始
  } else {
    song.pause();
    video.pause();
    play.src = "./svg/play.svg";
    stopTimer(); // 停止時にタイマーを停止
  }
};

let timerInterval;

function startTimer() {
  if (!timerInterval) { // タイマーが既に動いていないか確認
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    updateTimeDisplay();
    updateOutline();
  } else {
    stopTimer();
    song.pause();
    song.currentTime = 0;
    play.src = "./svg/play.svg";
    video.pause();
  }
}

function updateTimeDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // 2桁表示
}

function updateOutline() {
  const progress = outlineLength - ( (fakeDuration - timeLeft) / fakeDuration) * outlineLength;
  outline.style.strokeDashoffset = progress;
}

song.addEventListener('ended', () => {
    stopTimer(); //曲が終わったらタイマーを停止
    song.currentTime = 0;
    timeLeft = fakeDuration;
    updateTimeDisplay();
    updateOutline();
    play.src = "./svg/play.svg";
    video.pause();

});
