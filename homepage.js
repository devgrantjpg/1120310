import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// ✅ Replace with your actual Firebase config
const firebaseConfig = {
  // YOUR FIREBASE CONFIG HERE
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// ✅ Monitor auth state
onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem('loggedInUserId');

  if (user && loggedInUserId) {
    console.log("User is signed in:", user);

    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();

          // ✅ Safely update UI elements if they exist
          const firstNameEl = document.getElementById('loggedUserFName');
          const lastNameEl = document.getElementById('loggedUserLName');
          const emailEl = document.getElementById('loggedUserEmail');

          if (firstNameEl) firstNameEl.innerText = userData.firstName;
          if (lastNameEl) lastNameEl.innerText = userData.lastName;
          if (emailEl) emailEl.innerText = userData.email;

          // Optional: update navbar UI (e.g., change Sign In to Logout)
          const signInButton = document.querySelector('.signout-button');
          if (signInButton) signInButton.textContent = 'Logout';
          signInButton.id = 'logout'; // Add ID for consistency
        } else {
          console.warn("No matching user document found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  } else {
    console.log("No logged in user or missing localStorage ID.");
  }
});

// ✅ Safe logout handling
const logoutButton = document.getElementById('logout');

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
      .then(() => {
        window.location.href = 'index.html'; // or wherever your home page is
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  });
}
