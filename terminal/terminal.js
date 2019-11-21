// Copyright 2018 James C. (https://mrjamesco.uk)
// Released under MIT License

document.addEventListener("DOMContentLoaded", function() {
  M.FormSelect.init(document.querySelectorAll("select"));
});

var firebaseConfig = null;
var modalRef = null;
const request = fetch("../config.json", {credentials: "same-origin"})
  .then((response)   => { return response.json();       })
  .then((configJSON) => { firebaseConfig = configJSON.firebase; initApp(); })
  .catch((error)     => {
    document.querySelector("main").innerHTML = "<h1>Error</h1><h5>" + error + "</h5>";
    document.querySelector("main").style["text-align"] = "center";
  });

function initFirebase()
{
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  db.settings({
    timestampsInSnapshots: true
  });

  modalRef = db.doc('10ft/modal');
}

function updateModal()
{
  const message_type = document.querySelector("#type").value;
  const message_text = document.querySelector("#message").value;
  const message_duration = document.querySelector("#duration").value;

  modalRef.set({
    "type": message_type,
    "data": message_text,
    "timestamp": (1000 * message_duration) + Date.now()
  });
}

function stopModal()
{
  modalRef.set({
    "type": "",
    "data": "",
    "timestamp": 0
  });
}

function resetForm()
{
  document.querySelector("#message").value = "";
  document.querySelector("#duration").value = "60";
}


function initApp() {
  initFirebase();
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

    } else {



      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', {
        signInSuccessUrl: '#',
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        signInOptions: [
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false,
          }
        ]
      });
    }
  });
}

