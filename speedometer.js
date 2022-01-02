class Speedometer {
  init() {
    this.alertAudio = new Audio("alert.mp3");
    this.lastUpdatedAt = new Date();
    this.previousSpeedThreshold = -1;
    this.speed = 0;
    this.alertCooldown = 5000; // Duration for which another alert shouldn't be played
    this.lastAlertedAt = new Date() - this.alertCooldown;
    this.watch();
    window.requestAnimationFrame(this.updateLastUpdatedAt.bind(this));
  }

  // `level` is the level of the threshold, ranging from 0 to 10.
  playAlert(level) {
    if (new Date() - this.lastAlertedAt < this.alertCooldown) return;

    level = Math.min(level, 10);

    if (level < 3) return;

    this.alertAudio.volume = level / 10;
    this.alertAudio.play();

    this.lastAlertedAt = new Date();
  }

  speedAlert(speed) {
    const currentSpeedThreshold = Math.round(speed / 10);

    if (currentSpeedThreshold > this.previousSpeedThreshold)
      this.playAlert(currentSpeedThreshold);

    if (currentSpeedThreshold !== this.previousSpeedThreshold)
      this.previousSpeedThreshold = currentSpeedThreshold;
  }

  updateLastUpdatedAt() {
    const timeAgo = Math.round((new Date() - this.lastUpdatedAt) / 1000);
    document.querySelector(".updated span").innerHTML = timeAgo;
    window.requestAnimationFrame(this.updateLastUpdatedAt.bind(this));
  }

  updateSpeed(speed) {
    document.querySelector(".speed").innerHTML = speed;

    this.speedAlert(speed);
    this.speed = speed;
    this.lastUpdatedAt = new Date();
  }

  watch() {
    navigator.geolocation.watchPosition((position) => {
      this.updateSpeed(Math.round(position.coords.speed * 3.6));

      document.querySelector(".debug").innerHTML = JSON.stringify(
        position.coords
      );
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".start button").addEventListener("click", () => {
    document.querySelector(".start").classList.add("hidden");
    document.querySelector(".speedometer").classList.remove("hidden");
    new Speedometer().init();
  });
});
