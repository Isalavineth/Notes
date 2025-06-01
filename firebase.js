 const firebaseConfig = {
      apiKey: "AIzaSyDyykspgro46jjNldfMPGwNLOj_mztp7FA",
      authDomain: "sticky-bf1ab.firebaseapp.com",
      databaseURL: "https://sticky-bf1ab-default-rtdb.firebaseio.com/",
      projectId: "sticky-bf1ab",
      storageBucket: "sticky-bf1ab.firebasestorage.app",
      messagingSenderId: "696886870026",
      appId: "1:696886870026:web:5916f50dfe6c209cc11ff3"
    };

    firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();
    const database = firebase.database();
    const textRef = database.ref('sharedText');

    const loginBox = document.getElementById('login');
    const appBox = document.getElementById('app');
    const loginStatus = document.getElementById('loginStatus');
    const status = document.getElementById('status');
    const textInput = document.getElementById('textInput');

    function login() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          loginStatus.textContent = "";
          loginBox.style.display = 'none';
          appBox.style.display = 'flex';
        })
        .catch((error) => {
          console.error(error);
          loginStatus.textContent = error.message;
        });
    }

    function logout() {
      auth.signOut();
    }

    auth.onAuthStateChanged(user => {
      if (user) {
        loginBox.style.display = 'none';
        appBox.style.display = 'flex';

        // Load text
        textRef.once('value').then(snapshot => {
          const text = snapshot.val();
          if (text !== null) {
            textInput.value = text;
          }
        });

        // Save text
        textInput.addEventListener('input', () => {
          textRef.set(textInput.value)
            .then(() => {
              status.textContent = "Text saved successfully!";
              setTimeout(() => status.textContent = "", 2000);
            })
            .catch(error => {
              console.error("Error saving text: ", error);
              status.textContent = "Failed to save text.";
            });
        });

        // Sign out on tab/browser close
        window.addEventListener('beforeunload', () => {
          auth.signOut();
        });

      } else {
        appBox.style.display = 'none';
        loginBox.style.display = 'flex';
      }
    });