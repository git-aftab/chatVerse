// fireBase setUp
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword,setPersistence,browserLocalPersistence } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqFIPtHrV9kC7qLjjVmzcS6jAvc2_sis4",
  authDomain: "chatverse-d7324.firebaseapp.com",
  projectId: "chatverse-d7324",
  storageBucket: "chatverse-d7324.firebasestorage.app",
  messagingSenderId: "17133845603",
  appId: "1:17133845603:web:62aab79d8d09fa5d0acc56",
  measurementId: "G-TB41TXW57Y",
};

// Selectors
const wordElement = document.querySelectorAll(".changing-word");
const signInForm = document.getElementById("signIn-form")
const signInMail = document.getElementById("signIn-user-mail")
const signInPass = document.getElementById("signIn-pass")



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// user Authentication
const auth = getAuth(app);

document.getElementById("signUp-btn").addEventListener("click", (e) => {
  e.preventDefault();
});

document.getElementById("signUp-btn").addEventListener("click", () => {
  const email = document.getElementById("singUp-user").value;
  const pass = document.getElementById("signUp-pass").value;
  console.log(email, pass);

  createUserWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      alert("SignUp Successful! Welcom" + userCredential.user.email);
    })
    .catch((error) => {
      console.error("Error: ", error.message);
      console.error("Error Code: ", error.code);
      if (error.code === "auth/email-already-in-use") {
        alert("That email is already registered. Try logging in instead.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      } else {
        alert("Something went wrong: " + error.message);
      }
    });
});


// Word ring Login/SignUp
const words = [
  "Connection.",
  "Conversation.",
  "Communication.",
  "Interaction.",
  "Bond.",
  "Network.",
  "Exchange.",
  "Talks.",
  "Collaboration.",
];

let index = 0;
setInterval(() => {
  wordElement.forEach((el) => el.classList.add("fade-out"));

  setTimeout(() => {
    wordElement.forEach((el) => {
      el.textContent = words[index];
      el.classList.remove("fade-out");
      el.classList.add("fade-in");
    });
    setTimeout(() => {
      wordElement.forEach((el) => el.classList.remove("fade-in"));
    }, 300);
  }, 300);
  index = (index + 1) % words.length;
}, 1000);
