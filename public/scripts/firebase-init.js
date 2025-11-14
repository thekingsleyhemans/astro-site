// Firebase initialization (alternative setup - based on Firebase console code)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAVtJYxcK9Fqn3TkDntZM1oeGSV9BmHIc",
  authDomain: "hospitality-database-ceeb5.firebaseapp.com",
  projectId: "hospitality-database-ceeb5",
  storageBucket: "hospitality-database-ceeb5.firebasestorage.app",
  messagingSenderId: "167072220162",
  appId: "1:167072220162:web:d817ef477f07473bca531b",
  measurementId: "G-WQ62BL185J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export for use in other modules
export { app };
