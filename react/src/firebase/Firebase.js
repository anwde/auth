import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

var config = {
  // replace below with your created key db, etc...
  apiKey: "AIzaSyBH_q0m4sedJOrE3jUIH30CaZ7Bv57kCLE",
  authDomain: "xtreme-react-admin-68a8f.firebaseapp.com",
  databaseURL: "https://xtreme-react-admin-68a8f-default-rtdb.firebaseio.com",
  projectId: "xtreme-react-admin-68a8f",
  storageBucket: "xtreme-react-admin-68a8f.appspot.com",
  messagingSenderId: "671577245177",
  appId: "1:671577245177:web:349eff4c3d762a82d7e928",
  measurementId: "G-SH6QTX6XEJ",
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const Db = firebase.database();
const Auth = firebase.auth();

export { Db, Auth };
