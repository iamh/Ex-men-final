var data = require('./utils/profitoro-zayas-export.json');

var FirebaseServer = require('firebase-server');
var firebase = require('firebase');

var config = {
  databaseURL: "ws://127.0.1:5000",
};
var firebaseApp = firebase.initializeApp(config);
var client = firebaseApp.database();

console.log("****", client.ref('/').on)

new FirebaseServer(5000, '127.0.1', data).setAuthSecret('sRhN4rw1LfRCN8BXS5zCNpo3odJAWhTvLXXT8edk');

client.ref('/').on('value', function(snap) {
  console.log(JSON.stringify(snap.val(), null, '  '));
});