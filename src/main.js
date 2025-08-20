// fireBase setUp
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";

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
const signInPage = document.getElementById("singIn-page");
const signUpPage = document.getElementById("singUp-page1");
const signInForm = document.getElementById("signIn-form");
const signInMail = document.getElementById("signIn-user-mail");
const signInPass = document.getElementById("signIn-pass");
const signInLink = document.getElementById("signIn-link");
const signUpLink = document.getElementById("singUp-link");
const userChats = document.querySelectorAll(".user-chats");
const homePage = document.querySelector(".Home-page");

let isSignedIn = false;
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

// singIN Handler
signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // errorElement ---- do later

  const email = signInMail.value.trim();
  const pass = signInPass.value;

  try {
    // await setPersistence(auth,rem)
    const { user } = await signInWithEmailAndPassword(auth, email, pass);
    // success
    alert("Welcome Back " + (user.email || "user") + "!");
    isSignedIn = true;
  } catch (error) {
    console.error("Error Code: ", error.code);
    console.error("Error Message: ", error.message);
  }
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

// SignIn link setUp
signInLink.addEventListener("click", () => {
  signUpPage.classList.add("hidden");
  signInPage.classList.remove("hidden");
});
signUpLink.addEventListener("click", () => {
  signUpPage.classList.remove("hidden");
  signInPage.classList.add("hidden");
});

// Chats Section

// Active chats
userChats.forEach((chats, index) => {
  chats.addEventListener("click", () => {
    userChats.forEach((c) => {
      c.classList.remove("active-chat");
    });
    chats.classList.add("active-chat");
    chats.classList.remove("hover-chat");
    console.log(chats.textContent, index);
  });
});

// After signedIn Authentication using fire
onAuthStateChanged(auth,(user)=>{
  if(user){
    // signedIn
    console.log("SignedIn as: ",user.email)
    homePage.classList.remove("hidden")
    signInPage.classList.add("hidden")
  }else{
    signInPage.classList.remove("hidden")
    homePage.classList.add("hidden")
  }
})