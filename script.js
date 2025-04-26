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

  const screen2 = document.getElementById("screen2");
  screen2.classList.add("show"); // 鈴画面を表示

  motionAllowed = false;

  setTimeout(() => {
    alert("スマホを振ってお祈りしよう！"); // ポップアップ表示
    motionAllowed = true; // OK後、振動を許可
  }, 300); // 少し待ってからポップアップ

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
          alert("デバイスのモーションアクセスが許可されませんでした。");
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
  document.getElementById("screen3").classList.add("show");

  setTimeout(() => {
    openDoor();
  }, 1200);
}

function openDoor() {
  document.getElementById("screen3").classList.remove("show");
  document.getElementById("screen4").classList.add("show");
}

document.getElementById("offeringButton").addEventListener("click", showBell);
