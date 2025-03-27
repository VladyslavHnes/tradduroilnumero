import { useState, useEffect, useRef } from "react";
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

  const correctSoundRef = useRef(new Audio("/correct.mp3"));
  const incorrectSoundRef = useRef(new Audio("/incorrect.mp3"));

  useEffect(() => {
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

    correctSoundRef.current.pause();
    correctSoundRef.current.currentTime = 0;
    incorrectSoundRef.current.pause();
    incorrectSoundRef.current.currentTime = 0;

    if (input.trim().toLowerCase() === correct) {
      correctSoundRef.current.play();
      setFeedback("✅ Corretto!");
      speak(correct);
      setTimeout(() => {
        generateNumber();
      }, 1500);
    } else {
      incorrectSoundRef.current.play();
      setFeedback(`❌ Sbagliato. Corretto: "${correct}"`);
    }
  };

  const isCorrect = feedback.includes("Corretto!");

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#fef6e4",
        color: "#111",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          position: "relative",
          textAlign: "center",
          padding: 40,
          maxWidth: "600px",
          width: "100%",
          zIndex: 1 
        }}
      >
        <h1 style={{ color: "#d62828", fontSize: "2.8rem", marginBottom: 10 }}>
          Tradurro il numero
        </h1>
        <h2 style={{ fontSize: "4rem", color: "#001858", margin: "20px 0" }}>
          {number}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            checkAnswer();
          }}
          style={{ marginBottom: 20 }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi in italiano"
            style={{
              fontSize: "1.5rem",
              padding: "12px 24px",
              width: "100%",
              maxWidth: "320px",
              borderRadius: "12px",
              border: "2px solid #333",
              backgroundColor: "#ffffff",
              color: "#111"
            }}
          />
          <div style={{ marginTop: 20 }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#f3d2c1",
                color: "#111",
                fontSize: "1.1rem",
                padding: "12px 20px",
                borderRadius: "10px",
                marginRight: 10,
                border: "none"
              }}
            >
              Verifica
            </button>
            <button
              type="button"
              onClick={generateNumber}
              style={{
                backgroundColor: "#8bd3dd",
                color: "#111",
                fontSize: "1.1rem",
                padding: "12px 20px",
                borderRadius: "10px",
                border: "none"
              }}
            >
              Nuovo numero
            </button>
          </div>

          <div className="bauhaus-shape circle" style={{ top: -60, left: -60 }} />
          <div className="bauhaus-shape triangle" style={{ bottom: -80, right: -60 }} />
          <div className="bauhaus-shape square" style={{ top: 50, right: -80 }} />
        </form>

        <p
          style={{
            fontSize: "1.3rem",
            marginTop: 10,
            color: isCorrect ? "#30c16a" : feedback ? "#ef476f" : "#111"
          }}
        >
          {feedback}
        </p>
      </div>
    </div>
  );
}

export default App;
