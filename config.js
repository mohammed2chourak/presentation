/* =========================================================================
   config.js — technical settings (you set this once)
   ========================================================================= */
window.APP_CONFIG = {
  // Firebase Realtime Database (free plan is enough).
  // Leave databaseURL empty ("") to work in DEMO MODE only (no internet needed).
  // See README.md → "Firebase setup" to fill these values (copy them from the Firebase console).
  firebase: {
    apiKey: "AIzaSyCCMzFcpYQIsW9k_XPdJL5dLmxCiCGv3Cs",
    authDomain: "presentation-9c6f4.firebaseapp.com",
    databaseURL: "https://presentation-9c6f4-default-rtdb.europe-west1.firebasedatabase.app",   // e.g. "https://my-project-default-rtdb.europe-west1.firebasedatabase.app"
    projectId: "presentation-9c6f4",
    appId: "1:394110860987:web:955a4b8874ab0609a2b39e"
  },

  // Public address of the folder where you hosted these files (used by the QR code).
  // Leave empty when the presentation is opened from the hosted address itself.
  // Example: "https://yourname.github.io/presentation/"
  VOTE_BASE_URL: "https://mohammed2chourak.github.io/presentation/",

  AUTO_OPEN_VOTING: true,                 // voting opens automatically when you reach a poll/quiz slide
  ARROWS_FOLLOW_READING_DIRECTION: true,  // in Arabic: ← = next, → = previous (clickers using PageUp/PageDown always work)
  REDUCED_MOTION: false                   // true = fewer animations (weak projector laptops)
};
