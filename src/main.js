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
  signOut,
} from "firebase/auth";

import { getDatabase, ref, push, onChildAdded } from "firebase/database";
import firebase from "firebase/compat/app";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBqFIPtHrV9kC7qLjjVmzcS6jAvc2_sis4",
  authDomain: "chatverse-d7324.firebaseapp.com",
  projectId: "chatverse-d7324",
  storageBucket: "chatverse-d7324.firebasestorage.app",
  messagingSenderId: "17133845603",
  appId: "1:17133845603:web:62aab79d8d09fa5d0acc56",
  measurementId: "G-TB41TXW57Y",
  databaseURL:
    "https://chatverse-d7324-default-rtdb.europe-west1.firebasedatabase.app/",
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
const msgArea = document.getElementById("msg-area");
const msgInput = document.getElementById("msg-input");
const msgSendBtn = document.getElementById("msg-send-btn");
const logOutBtn = document.getElementById("logout-btn");
const userDetails = document.getElementById("user-details");
const editBtn = document.getElementById("edit-btn");
const userProfileName = document.getElementById("user-profile-name");
const aboutUser = document.getElementById("about-user");
const profileImg = document.getElementById("profileImg");
const imgInput = document.getElementById("imgInput");
const userCard = document.getElementById("user-card");

let isEditing = false;

let isSignOut = false;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Realtime Database
const db = getDatabase(app);
const storage = getStorage();

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

// LogOut Logic
function logOutFunc() {
  const confirmLogOut = confirm("Do you want to LogOut");
  if (confirmLogOut) {
    signOut(auth)
      .then(() => {
        console.log("user logged Out");
        window.location.herf = "login.html";
      })
      .catch((error) => console.error("logout error", error.message));
  } else {
    console.log("LogOut cancelled");
    isSignOut = false;
  }
}
logOutBtn.addEventListener("click", logOutFunc);

// user details
function showUserDetails() {
  console.log("Clicked user-details");
  userCard.classList.toggle("hidden");
  // main.addEventListener("click",()=>{
  //   userCard.classList.remove("hidden")
  // })
}
userDetails.addEventListener("click", showUserDetails);

// Editing Usercard
editBtn.addEventListener("click", () => {
  if (!isEditing) {
    // enable editting
    userProfileName.contentEditable = true;
    aboutUser.contentEditable = true;

    userProfileName.style.borderBottom = "1px dashed #333";
    aboutUser.style.borderBottom = "1px dashed #333";

    profileImg.style.cursor = "pointer";
    profileImg.addEventListener("click", () => imgInput.click());

    editBtn.textContent = "Save";
    isEditing = true;
  } else {
    // save
    userProfileName.contentEditable = false;
    aboutUser.contentEditable = false;

    userProfileName.style.borderBottom = "none";
    aboutUser.style.borderBottom = "none";
    profileImg.style.cursor = "default";

    // here you can save to localStorage or Firebase DB
    console.log("Name:", userProfileName.textContent);
    console.log("About:", aboutUser.textContent);
    console.log("Profile Img:", profileImg.src);

    editBtn.textContent = "Edit";
    isEditing = false;
  }
});
// Handling Image upload & preview
imgInput.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (loadEvt) => {
    profileImg.src = loadEvt.target.result; // ✅ correct
    // or: profileImg.src = reader.result;     // ✅ also fine
  };
  reader.readAsDataURL(file);
});

// Upload Profile Image to Firebase Storage
async function upLoadProfileImage(file) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    // storage reference
    const storageRef = ref(storage, `profileImages/${user.uid}`);

    // upload file
    await uploadBytes(storageRef, file);

    // get download url
    const downloadUrl = await getDownloadURL(storageRef);

    // save it in the firestore
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      profileImgUrl: downloadUrl,
      updatedAt: new Date(),
    });
    console.log("Profile image uploaded & Firestore updated:", downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading profile image:", error);
  }
}

// update user profile info(userName,bio,about)
async function updateUserProfile({ username, bio }) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("user no logged in");

    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        username,
        bio,
        email: user.email,
        createdAt: new Date(),
      },
      { merge: true }
    ); // merge keeps old data safe

    console.log("profile updated successfully");
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}




// Fetch Profile (for showing in Sidebar / Chat)
async function getUserProfile(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.log("Error fetching profile:", error);
  }
}

// -------------------
// Save Profile Function
// -------------------
async function saveProfile(userId, profileData) {
  try {
    // Reference to the user's document
    const userDocRef = doc(db, "users", userId);

    // Save or update the document
    await setDoc(userDocRef, profileData, { merge: true });

    console.log("Profile saved successfully!");
  } catch (error) {
    console.error("Error saving profile:", error);
  }
}

// Example usage when user clicks Save button
editBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("Not signed in!");

  // Collect data from inputs
  const name = document.getElementById("user-profile-name").value;
  const bio = document.getElementById("about-user").value;
  const photoURL = document.getElementById("imgInput").value; // e.g., URL or base64

  await saveProfile(user.uid, { name, bio, photoURL });
});


// -------------------
// Fetch + Display Profile
// -------------------
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        // Update UI
        userProfileName.textContent = userData.name || "";
        aboutUser.textContent = userData.bio || "";
        imgInput.src = userData.photoURL || "default.png";
      } else {
        console.log("No profile data found for user.");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  } else {
    console.log("No user signed in.");
  }
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
onAuthStateChanged(auth, (user) => {
  if (user) {
    // signedIn
    console.log("SignedIn as: ", user.email);
    homePage.classList.remove("hidden");
    signInPage.classList.add("hidden");
  } else {
    signInPage.classList.remove("hidden");
    homePage.classList.add("hidden");
  }
});

// msg-input ---- msg sending logic
const msgSendingfunc = () => {
  console.log("clicked the send btn");
  if (msgInput.value.length === 0) return;
  // msg object for firebase storage
  let message = {
    text: msgInput.value,
    sender: "user1",
    timeStamp: Date.now(),
  };
  console.log("sending msg");
  push(ref(db, "messages"), message);
  msgInput.value = "";
};
msgSendBtn.addEventListener("click", msgSendingfunc);
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // stop newline
    msgSendingfunc();
  }
});

onChildAdded(ref(db, "messages"), (snapshot) => {
  let msg = snapshot.val();

  let newMsg = document.createElement("p");
  newMsg.innerText = msg.text;

  if (msg.sender === "user1") {
    newMsg.classList.add("sent-msg");
  } else {
    newMsg.classList.remove("reply-msg");
  }
  msgArea.append(newMsg);
  msgArea.scrollTop = msgArea.scrollHeight;
});
