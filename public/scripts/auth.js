// Authentication module using Firebase
import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check authentication state on page load
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in:', user.email);
    // Redirect to dashboard or home page
    // window.location.href = '/index.html';
  } else {
    console.log('User not logged in');
  }
});

// Handle Signup Form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const messageDiv = document.getElementById('signupMessage');

    // Validation
    if (password !== confirmPassword) {
      messageDiv.textContent = 'Passwords do not match!';
      messageDiv.style.color = '#e74c3c';
      return;
    }

    if (password.length < 6) {
      messageDiv.textContent = 'Password must be at least 6 characters!';
      messageDiv.style.color = '#e74c3c';
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      try {
        await updateProfile(user, { displayName: name });
        console.log('Profile updated with displayName:', name);
      } catch (profileError) {
        console.warn('Could not set displayName:', profileError);
      }

      // Store user information (optional - requires Firestore)
      console.log('User created:', user);

      if (messageDiv) {
        messageDiv.textContent = 'Account created successfully! Redirecting...';
        messageDiv.style.color = '#27ae60';
      }

      // Redirect to login or dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (error) {
      console.error('Signup error:', error);
      if (messageDiv) {
        messageDiv.textContent = error.message;
        messageDiv.style.color = '#e74c3c';
      }
    }
  });
}

// Handle Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');

    try {
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User logged in:', user);

      messageDiv.textContent = 'Login successful! Redirecting...';
      messageDiv.style.color = '#27ae60';

      // Redirect to dashboard or home page after 2 seconds
      setTimeout(() => {
        // Redirect to root (Astro index route)
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      console.error('Login error:', error);
      messageDiv.textContent = error.message;
      messageDiv.style.color = '#e74c3c';
    }
  });
}

// Logout function (call this from your navigation/profile menu)
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User logged out');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Export auth for use in other modules
export { auth };
