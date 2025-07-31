import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaPlay, FaStop, FaRedo, FaFlag } from "react-icons/fa";

export default function App() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [justReset, setJustReset] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Timer logic
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => setTime((prev) => prev + 10), 10);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // Theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "s") setIsRunning(true);
      if (e.key === "t") setIsRunning(false);
      if (e.key === "r") handleReset();
      if (e.key === "l") handleLap();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isRunning, laps]);

  const formatTime = (ms) => {
    const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${minutes}:${seconds}:${centiseconds}`;
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    setJustReset(true);
    setTimeout(() => setJustReset(false), 1200);
  };

  const handleLap = () => {
    if (isRunning && laps.length < 100) {
      setLaps([...laps, time]);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-4 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 to-black text-white"
          : "bg-gradient-to-br from-white to-gray-100 text-black"
      }`}
    >
      <div className="relative bg-zinc-300 bg-opacity-20 dark:bg-black/30 backdrop-blur-lg p-12 rounded-3xl shadow-2xl border border-gray-300/30 dark:border-gray-600/20 text-center w-full max-w-[500px] transition-all duration-300">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="absolute top-4 left-4 px-4 py-2 text-sm rounded-lg bg-white/20 dark:bg-black/20 hover:bg-opacity-40 dark:hover:bg-opacity-40 backdrop-blur border border-gray-300 shadow-md transition-all"
        >
          {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button>

        {/* Clock Emoji */}
        <div className="absolute top-4 right-4 text-gray-400 text-sm">⏱️</div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-6 tracking-widest dark:text-white text-black">Stopwatch</h1>

        {/* Time Display */}
        <div className="text-4xl font-mono font-semibold bg-black/60 dark:bg-white/10 p-6 rounded-2xl shadow-inner mb-4 border border-gray-500 relative transition-all">
          {formatTime(time)}
          <div className="absolute top-2 right-3 text-xs text-gray-400">Live</div>
        </div>

        {/* Messages */}
        {justReset && (
          <div className="text-sm text-blue-400 mb-2 animate-pulse">
            Stopwatch reset!
          </div>
        )}
        {!isRunning && time > 0 && !justReset && (
          <div className="text-sm text-yellow-300 mb-2 animate-pulse">
            Stopwatch paused
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mb-6">
          <button
            onClick={() => setIsRunning(true)}
            disabled={isRunning}
            aria-label="Start"
            className={`px-8 py-4 rounded-lg bg-green-500 hover:bg-green-600 active:scale-95 transition-all text-xl font-bold shadow-lg flex items-center space-x-3 ${
              isRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaPlay /> <span>Start</span>
          </button>
          <button
            onClick={() => setIsRunning(false)}
            aria-label="Stop"
            className="px-8 py-4 rounded-lg bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-xl font-bold shadow-lg flex items-center space-x-3"
          >
            <FaStop /> <span>Stop</span>
          </button>
          <button
            onClick={handleReset}
            aria-label="Reset"
            className="px-8 py-4 rounded-lg bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-xl font-bold shadow-lg flex items-center space-x-3"
          >
            <FaRedo /> <span>Reset</span>
          </button>
          <button
            onClick={handleLap}
            aria-label="Lap"
            className="px-8 py-4 rounded-lg bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all text-xl font-bold shadow-lg flex items-center space-x-3"
          >
            <FaFlag /> <span>Lap</span>
          </button>
        </div>

        {/* Lap List */}
        <AnimatePresence>
          {laps.length > 0 && (
            <motion.div
              key="lap-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="text-left max-h-48 overflow-y-auto bg-black/40 dark:bg-black/60 backdrop-blur-md rounded-xl p-4 border border-gray-700 shadow-inner mt-4"
            >
              <h2 className="text-lg font-bold mb-2 text-gray-300">Laps:</h2>
              <ul className="space-y-1 text-sm text-gray-200">
                {laps.map((lap, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    🏁 <strong>Lap {index + 1}:</strong> {formatTime(lap)}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
