let wish = "";
let motionAllowed = false;
let shaking = false;

function showBell() {
  wish = document.getElementById("wishInput").value.trim();
  if (wish === "") {
    return; // 入力がなければ何もせず終了
  }
  document.getElementById("screen1").classList.add("hidden");

  const screen2 = document.getElementById("screen2");
  screen2.classList.remove("hidden"); // ★必ずhiddenを外す！
  screen2.classList.add("show");       // ★次にshowを付ける！

  motionAllowed = false;

  setTimeout(() => {
    const instruction = document.getElementById("instruction");
    instruction.classList.remove("hidden");
    instruction.classList.add("show");

    setTimeout(() => {
      instruction.classList.remove("show");
      instruction.classList.add("hidden");
      motionAllowed = true;
    }, 3000);

  }, 100);

  const audio = document.getElementById("bellSound");
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
  }).catch(() => {
    console.log("Audio preload skipped.");
  });

  if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState !== "granted") {
          // 何もしない
        }
      })
      .catch(console.error);
  }
}

window.addEventListener('devicemotion', function(event) {
  if (!motionAllowed || shaking) return;
  if (!document.getElementById("screen2").classList.contains("show")) {
    return;
  }
  const acceleration = event.accelerationIncludingGravity;
  const threshold = 12;
  if (acceleration && (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold)) {
    shakeBell();
  }
});

function shakeBell() {
  if (shaking) return;

  shaking = true;
  const bell = document.getElementById("bell");
  const audio = document.getElementById("bellSound");

  bell.classList.add("shake");
  try {
    audio.currentTime = 0;
    audio.play();
  } catch (e) {}

  setTimeout(() => {
    bell.classList.remove("shake");
    moveToDoor();
  }, 1000);
}

function moveToDoor() {
  document.getElementById("screen2").classList.remove("show");
  document.getElementById("screen2").classList.add("hidden");

  const screen3 = document.getElementById("screen3");
  screen3.classList.remove("hidden");
  screen3.classList.add("show");

  setTimeout(() => {
    openDoor();
  }, 1200);
}

function openDoor() {
  document.getElementById("screen3").classList.remove("show");
  document.getElementById("screen3").classList.add("hidden");

  const screen4 = document.getElementById("screen4");
  screen4.classList.remove("hidden");
  screen4.classList.add("show");
}

document.getElementById("offeringButton").addEventListener("click", showBell);
