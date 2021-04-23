const playerElement = document.querySelector('.player');
const video = document.getElementById('video');
const playAgainElement = document.querySelector('.play-again');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const speedElement = document.querySelector('.player-speed');
const currentTimeElement = document.querySelector('.time-elapsed');
const durationElement = document.querySelector('.time-duration');
const fullscreenElement = document.querySelector('.fullscreen');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Play & Pause ----------------------------------- //

function playVideo() {
    video.play();
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    playAgainElement.hidden = true;
}

function showPlayIcon(event) {
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    if (event && event.type === 'ended') {
        playAgainElement.hidden = false;
    }
}

function togglePlay(event) {
    if (video.paused) {
        playVideo();
    } else {
        video.pause();
        showPlayIcon();
    }
}


// Progress Bar ---------------------------------- //

// Update DOM of progress bar as the video progresses
function updateProgress() {
    const { duration, currentTime } = video;

    // Update Progress Bar width in CSS
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Get duration and currentTime in minutes to 2 decimal places, convert to String, replace . with :, check for NaN, and update DOM 
    const durationMinutes = (duration / 60).toFixed(2);
    const currentTimeMinutes = (currentTime / 60).toFixed(2);
    durationElement.textContent = isNaN(durationMinutes) ? '00:00' : durationMinutes.toString().replace('.', ':');
    currentTimeElement.textContent = currentTimeMinutes.toString().replace('.', ':') + " / ";
}

// Click anywhere on the progress Bar to play from there - Update Progress bar, change video's current time
function setProgress(event) {
    const newtime = event.offsetX / progressRange.offsetWidth;
    progressBar.style.width = `${newtime * 100}%`;
    video.currentTime = newtime * video.duration;
}


// Volume Controls --------------------------- //

let volume = 1;

// Change volume icon based on range
function changeVolumeIcon() {
    volumeIcon.className = '';
    if (video.volume > 0.7) {
        volumeIcon.classList.add('fas', 'fa-volume-up');
    } else if (video.volume < 0.7 && video.volume > 0) {
        volumeIcon.classList.add('fas', 'fa-volume-down');
    } else if (video.volume === 0) {
        volumeIcon.classList.add('fas', 'fa-volume-mute');
    }
}

// Click anywhere on the volume Bar - Update Volume bar, change video's volume, set global volume variable, change volume icon
function changeVolume(event) {
    let newVolume = event.offsetX / volumeRange.offsetWidth;
    newVolume = (newVolume < 0.1) ? 0 : newVolume;
    newVolume = (newVolume > 0.9) ? 1 : newVolume;

    volumeBar.style.width = `${newVolume * 100}%`;
    video.volume = newVolume;
    volume = newVolume;
    changeVolumeIcon();
}

// Mute / Unmute
function toggleMute() {
    if (video.volume) {
        video.volume = 0;
        volumeIcon.setAttribute('title', 'Unmute');
        volumeBar.style.width = 0;
    } else {
        video.volume = volume;
        volumeIcon.setAttribute('title', 'Mute');
        volumeBar.style.width = `${volume * 100}%`;;
    }
    changeVolumeIcon();
}


// Change Playback Speed -------------------- //

function changePlaybackRate() {
    video.playbackRate = speedElement.value;
}

// Fullscreen ------------------------------- //

let fullscreen = false;

/* View in fullscreen */
function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
    fullscreenBtn.classList.replace('fa-expand', 'fa-compress');
    video.classList.add('video-fullscreen');
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
    fullscreenBtn.classList.replace('fa-compress', 'fa-expand');
    video.classList.remove('video-fullscreen');
}

function toggleFullScreen() {
    fullscreen ? closeFullscreen() : openFullscreen(playerElement);
    fullscreen = !fullscreen;
}


// Event Listeners ------------------------------- //
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('ended', showPlayIcon);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
playAgainElement.addEventListener('click', playVideo);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speedElement.addEventListener('change', changePlaybackRate);
fullscreenElement.addEventListener('click', toggleFullScreen);