/* =========================================================
   1. MUSIC PLAYLIST — edit this list to add your songs.
   Put your mp3 files in the /music folder, then add a line here.
   ========================================================= */
const TRACKS = [
  { title: "First Song",  artist: "your name", src: "music/first-song.mp3" },
  { title: "Second Song", artist: "your name", src: "music/second-song.mp3" },
  { title: "Third Song",  artist: "your name", src: "music/third-song.mp3" },
];

/* =========================================================
   3. Page switching (hash-based, so the music never stops)
   ========================================================= */
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav a");
const nav = document.getElementById("nav");
const menuBtn = document.querySelector(".menu-btn");

function showPage() {
  const id = (location.hash || "#home").slice(1);
  const target = document.getElementById(id) ? id : "home";
  pages.forEach(p => p.classList.toggle("active", p.id === target));
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + target));
  nav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", showPage);

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

/* =========================================================
   4. "Latest from the blog" on the home page
   Builds itself from the posts in the blog section.
   ========================================================= */
function buildLatestPosts() {
  const posts = [...document.querySelectorAll("#post-list .post")]
    .sort((a, b) => b.dataset.date.localeCompare(a.dataset.date))
    .slice(0, 3);
  const box = document.getElementById("latest-posts");
  box.innerHTML = "";
  posts.forEach(p => {
    const title = p.querySelector("h2").textContent;
    const date = p.querySelector("time").textContent;
    const first = p.querySelectorAll("p")[1]?.textContent || "";
    const el = document.createElement("article");
    el.className = "post";
    el.innerHTML = `<h3 style="margin:0"><a href="#blog"></a></h3>
      <p class="post-meta"></p><p class="post-excerpt"></p>`;
    el.querySelector("a").textContent = title;
    el.querySelector(".post-meta").textContent = date;
    el.querySelector(".post-excerpt").textContent = first.length > 140 ? first.slice(0, 140) + "…" : first;
    box.appendChild(el);
  });
}

/* =========================================================
   5. Lightbox for gallery images
   ========================================================= */
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector("img");
const lbCap = lightbox.querySelector(".lightbox-caption");

document.addEventListener("click", e => {
  const img = e.target.closest("[data-gallery] figure img");
  if (img) {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.closest("figure").querySelector("figcaption")?.textContent || "";
    lightbox.hidden = false;
  } else if (e.target === lightbox || e.target.classList.contains("lightbox-close")) {
    lightbox.hidden = true;
  }
});
document.addEventListener("keydown", e => { if (e.key === "Escape") lightbox.hidden = true; });

/* =========================================================
   6. Music player
   ========================================================= */
const audio = document.getElementById("audio");
const player = document.getElementById("player");
const btnPlay = document.getElementById("btn-play");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnShuffle = document.getElementById("btn-shuffle");
const seek = document.getElementById("seek");
const volume = document.getElementById("volume");
const titleEl = document.getElementById("track-title");
const artistEl = document.getElementById("track-artist");
const timeNow = document.getElementById("time-now");
const timeTotal = document.getElementById("time-total");
const playlistEl = document.getElementById("playlist");

let current = 0;
let shuffle = false;
let seeking = false;

const fmt = s => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return m + ":" + String(Math.floor(s % 60)).padStart(2, "0");
};

function renderPlaylist() {
  playlistEl.innerHTML = "";
  TRACKS.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = t.title;
    li.addEventListener("click", () => { loadTrack(i); play(); });
    playlistEl.appendChild(li);
  });
}

function loadTrack(i) {
  current = (i + TRACKS.length) % TRACKS.length;
  const t = TRACKS[current];
  audio.src = t.src;
  titleEl.textContent = t.title;
  artistEl.textContent = t.artist;
  seek.value = 0;
  timeNow.textContent = "0:00";
  timeTotal.textContent = "0:00";
  [...playlistEl.children].forEach((li, idx) => li.classList.toggle("current", idx === current));
}

function play() {
  audio.play().then(() => { btnPlay.textContent = "⏸"; }).catch(() => {
    btnPlay.textContent = "▶";
    artistEl.textContent = "couldn't play this file. Check the path in script.js";
  });
}
function pause() { audio.pause(); btnPlay.textContent = "▶"; }

function nextIndex() {
  if (!shuffle || TRACKS.length < 2) return current + 1;
  let n;
  do { n = Math.floor(Math.random() * TRACKS.length); } while (n === current);
  return n;
}

btnPlay.addEventListener("click", () => { audio.paused ? play() : pause(); });
btnNext.addEventListener("click", () => { loadTrack(nextIndex()); play(); });
btnPrev.addEventListener("click", () => {
  if (audio.currentTime > 3) audio.currentTime = 0;
  else { loadTrack(current - 1); play(); }
});
btnShuffle.addEventListener("click", () => {
  shuffle = !shuffle;
  btnShuffle.classList.toggle("on", shuffle);
});

audio.addEventListener("ended", () => { loadTrack(nextIndex()); play(); });
audio.addEventListener("loadedmetadata", () => { timeTotal.textContent = fmt(audio.duration); });
audio.addEventListener("timeupdate", () => {
  if (seeking || !audio.duration) return;
  seek.value = (audio.currentTime / audio.duration) * 100;
  timeNow.textContent = fmt(audio.currentTime);
});
seek.addEventListener("input", () => {
  seeking = true;
  if (audio.duration) timeNow.textContent = fmt((seek.value / 100) * audio.duration);
});
seek.addEventListener("change", () => {
  if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  seeking = false;
});
volume.addEventListener("input", () => { audio.volume = volume.value; });
audio.volume = volume.value;

// show/hide the player; remember the choice
const toggle = document.getElementById("player-toggle");
try { if (localStorage.getItem("playerCollapsed") === "0") player.classList.remove("collapsed"); } catch (e) {}
toggle.addEventListener("click", () => {
  const c = player.classList.toggle("collapsed");
  try { localStorage.setItem("playerCollapsed", c ? "1" : "0"); } catch (e) {}
});

/* =========================================================
   7. Start everything
   ========================================================= */
document.getElementById("year").textContent = new Date().getFullYear();
buildLatestPosts();
renderPlaylist();
if (TRACKS.length) loadTrack(0);
showPage();
