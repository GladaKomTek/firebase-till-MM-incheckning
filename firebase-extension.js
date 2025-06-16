// Importera Firebase bibliotek
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Din Firebase-konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyCyEi3GcT1pidPveKo8MWpgpTWI81mnxJQ",
  authDomain: "visitor-counter-display.firebaseapp.com",
  databaseURL: "https://visitor-counter-display-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "visitor-counter-display",
  storageBucket: "visitor-counter-display.appspot.com",
  messagingSenderId: "1039556828713",
  appId: "1:1039556828713:web:e65c11ff4f6754be040638"
};

// Initiera Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

class FirebaseExtension {
  constructor() {
    this.lastValue = ""; // för getLatestData
  }

  getInfo() {
    return {
      id: 'firebaseext',
      name: 'Firebase',
      color1: '#FFA500',
      blocks: [
        {
          opcode: 'setData',
          blockType: Scratch.BlockType.COMMAND,
          text: 'sätt [key] till [value]',
          arguments: {
            key: { type: Scratch.ArgumentType.STRING, defaultValue: "besökare" },
            value: { type: Scratch.ArgumentType.STRING, defaultValue: "123" }
          }
        },
        {
          opcode: 'getData',
          blockType: Scratch.BlockType.REPORTER,
          text: 'hämta [key]',
          arguments: {
            key: { type: Scratch.ArgumentType.STRING, defaultValue: "besökare" }
          }
        },
        {
          opcode: 'listenData',
          blockType: Scratch.BlockType.COMMAND,
          text: 'lyssna på [key]',
          arguments: {
            key: { type: Scratch.ArgumentType.STRING, defaultValue: "besökare" }
          }
        },
        {
          opcode: 'getLatestData',
          blockType: Scratch.BlockType.REPORTER,
          text: 'senaste värdet',
        }
      ]
    };
  }

  // Sätt data
  setData(args) {
    const dbRef = ref(db, args.key);
    set(dbRef, args.value);
  }

  // Hämta data en gång
  async getData(args) {
    const dbRef = ref(db, args.key);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return "ingen data";
    }
  }

  // Lyssna på förändringar (push)
  listenData(args) {
    const dbRef = ref(db, args.key);
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        this.lastValue = snapshot.val();
      } else {
        this.lastValue = "ingen data";
      }
    });
  }

  // Returnera senaste lyssnade värde
  getLatestData() {
    return this.lastValue;
  }
}

Scratch.extensions.register(new FirebaseExtension());
