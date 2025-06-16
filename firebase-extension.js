// Importera Firebase bibliotek (måste funka i TurboWarp Packager)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Din Firebase-konfiguration – byt ut mot din egen!
const firebaseConfig = {
  apiKey: "AIzaSyCyEi3GcT1pidPveKo8MWpgpTWI81mnxJQ",
  authDomain: "visitor-counter-display.firebaseapp.com",
  databaseURL: "https://visitor-counter-display-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "visitor-counter-display",
  storageBucket: "visitor-counter-display.firebasestorage.app",
  messagingSenderId: "1039556828713",
  appId: "1:1039556828713:web:e65c11ff4f6754be040638"
};

// Initiera Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Skapa en TurboWarp Extension med Firebase-block
class FirebaseExtension {
  getInfo() {
    return {
      id: 'firebaseext',
      name: 'Firebase',
      color1: '#FFA500',
      color2: '#FF8C00',
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
        }
      ]
    };
  }

  // Sätt data i Firebase
  setData(args) {
    const dbRef = ref(db, args.key);
    set(dbRef, args.value);
  }

  // Hämta data från Firebase (asynkront)
  async getData(args) {
    const dbRef = ref(db, args.key);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return "ingen data";
    }
  }
}

// Registrera extension hos Scratch
Scratch.extensions.register(new FirebaseExtension());
