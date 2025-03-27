import { useState, useEffect } from "react";
import "./App.css";

const numberToItalian = {
  1: "uno", 2: "due", 3: "tre", 4: "quattro", 5: "cinque", 6: "sei", 7: "sette", 8: "otto", 9: "nove", 10: "dieci",
  11: "undici", 12: "dodici", 13: "tredici", 14: "quattordici", 15: "quindici", 16: "sedici", 17: "diciassette",
  18: "diciotto", 19: "diciannove", 20: "venti", 30: "trenta", 40: "quaranta", 50: "cinquanta",
  60: "sessanta", 70: "settanta", 80: "ottanta", 90: "novanta", 100: "cento"
};

function getItalianNumber(n) {
  if (n <= 20 || n === 100) return numberToItalian[n];
  const tens = Math.floor(n / 10) * 10;
  const units = n % 10;
  return units === 0
    ? numberToItalian[tens]
    : numberToItalian[tens] + numberToItalian[units];
}

function App() {
  const [number, setNumber] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [voice, setVoice] = useState(null);

  const correctSound = new Audio("/correct.mp3");
  const incorrectSound = new Audio("/incorrect.mp3");

  useEffect(() => {
    // Load Italian voice
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const italianVoice = voices.find(v => v.lang.startsWith("it"));
      if (italianVoice) setVoice(italianVoice);
    };

    if (typeof window !== "undefined" && window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    generateNumber();
  }, []);

  const speak = (text) => {
    if (!voice) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    utter.lang = "it-IT";
    window.speechSynthesis.speak(utter);
  };

  const generateNumber = () => {
    const newNumber = Math.floor(Math.random() * 100) + 1;
    setNumber(newNumber);
    setInput("");
    setFeedback("");
  };

  const checkAnswer = () => {
    const correct = getItalianNumber(number);

    correctSound.pause();
    correctSound.currentTime = 0;
    incorrectSound.pause();
    incorrectSound.currentTime = 0;

    if (input.trim().toLowerCase() === correct) {
      correctSound.play();
      setFeedback("✅ Corretto!");
      speak(getItalianNumber(number)); // Speak the number after correct answer
      setTimeout(() => {
        generateNumber();
      }, 1500); // wait a bit before generating the new number
    } else {
      incorrectSound.play();
      setFeedback(`❌ Sbagliato. Corretto: "${correct}"`);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial", textAlign: "center" }}>
      <h1>Tradurro il numero</h1>
      <h2 style={{ fontSize: "3rem" }}>{number}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          checkAnswer();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi in italiano"
          style={{
            fontSize: "1.5rem",
            padding: "10px 20px",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
        <div style={{ marginTop: 10 }}>
          <button type="submit" style={{ fontSize: "1rem", padding: "10px 15px" }}>
            Verifica
          </button>
          <button
            type="button"
            onClick={generateNumber}
            style={{ fontSize: "1rem", padding: "10px 15px", marginLeft: 10 }}
          >
            Nuovo numero
          </button>
        </div>
      </form>

      <p style={{ marginTop: 20, fontSize: "1.2rem" }}>{feedback}</p>
    </div>
  );
}

export default App;
