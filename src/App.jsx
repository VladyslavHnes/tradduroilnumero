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

  const correctSound = new Audio("/correct.mp3");
  const incorrectSound = new Audio("/incorrect.mp3");

  const generateNumber = () => {
    setNumber(Math.floor(Math.random() * 100) + 1);
    setInput("");
    setFeedback("");
  };

  useEffect(() => {
    generateNumber();
  }, []);

  const checkAnswer = () => {
    const correct = getItalianNumber(number);

    // Reset both sounds in case they're currently playing
    correctSound.pause();
    correctSound.currentTime = 0;
    incorrectSound.pause();
    incorrectSound.currentTime = 0;

    if (input.trim().toLowerCase() === correct) {
      correctSound.play();
      setFeedback("✅ Correct!");
      setTimeout(() => {
        generateNumber();
      }, 2000);
    } else {
      incorrectSound.play();
      setFeedback(`❌ Wrong. Correct: "${correct}"`);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial", textAlign: "center" }}>
      <h1>Translate the Number</h1>
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
          placeholder="Type in Italian"
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
            Check
          </button>
          <button
            type="button"
            onClick={generateNumber}
            style={{ fontSize: "1rem", padding: "10px 15px", marginLeft: 10 }}
          >
            New Number
          </button>
        </div>
      </form>

      <p style={{ marginTop: 20, fontSize: "1.2rem" }}>{feedback}</p>
    </div>
  );
}

export default App;
