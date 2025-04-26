let wish = "";
let motionAllowed = false;
let shaking = false;

function showBell() {
  wish = document.getElementById("wishInput").value.trim();
  if (wish === "") {
    alert("お願いごとを入力してください");
    return;
  }
  document.getElementById("screen1").classList.add("hidden");
  document.getElementById("screen2").classList.remove("hidden");

  const instruction = document.getElementById("instruction");
  instruction.classList.remove("hidden");
  setTimeout(() => {
    instruction.classList.add("hidden");
  }, 1500);

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
        if (permissionState === "granted") {
          motionAllowed = true;
        } else {
          alert("デバイスのモーションアクセスが許可されませんでした。");
        }
      })
      .catch(console.error);
  } else {
    motionAllowed = true;
  }
}

window.addEventListener('devicemotion', function(event) {
  if (!motionAllowed || shaking) return;
  if (!document.getElementById("screen2").classList.contains("hidden")) {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 12;
    if (acceleration && (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold)) {
      shakeBell();
    }
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
  document.getElementById("screen2").classList.add("hidden");
  document.getElementById("screen3").classList.remove("hidden");

  setTimeout(() => {
    openDoor();
  }, 1200);
}

function openDoor() {
  document.getElementById("screen3").classList.add("hidden");
  document.getElementById("screen4").classList.remove("hidden");
}

document.getElementById("offeringButton").addEventListener("click", showBell);
