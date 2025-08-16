const texts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet and is commonly used for typing practice.",
  "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.",
  "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.",
  "All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.",
];

const textDisplay = document.querySelector("#textDisplay");
const inputArea = document.querySelector("#inputArea");
const startBtn = document.querySelector("#startBtn");
const resetBtn = document.querySelector("#resetBtn");
const timer = document.querySelector("#timer");
const characters = document.querySelector("#characters");
const accuracy = document.querySelector("#accuracy");
const wpm = document.querySelector("#wpm");
const progressFill = document.querySelector("#progressFill");
const completionMessage = document.querySelector(".completion-message");
const finalStats = document.querySelector("#finalStats");
const bestScore = document.querySelector("#bestScore");
const bestWPMResult = document.querySelector("#bestWPM");

//timer function
let totalTime = 60;
let timeInterval;
function timeFunction() {
  if (timeInterval) {
    clearInterval(timeInterval);
    timer.textContent = `${totalTime}s`;
  }
  timeInterval = setInterval(() => {
    totalTime--;
    timer.textContent = `${totalTime}s`;

    if (totalTime <= 0) {
      clearInterval(timeInterval);
      timer.textContent = `00s`;
      inputArea.disabled = true;
      completionMessage.style.display = "block";
      finalStats.innerHTML = `Your Speed: <b>${wpmCalculator} wpm</b><br>
       Accuracy: <b>${accuracyPercentage}%</b><br>
       Characters Typed: <b>${inputValue.length}/${paraLength}</b>`;
      startBtn.textContent = "times up !!!";
      wpmScores(wpmCalculator);
    }
  }, 1000);
}

//displaying random text for test
let randomPara;
let correctWords = 0;
let paraLength;
let chars;

//getting random qs
function randomQs() {
  randomPara = texts[Math.floor(Math.random() * texts.length)];
  paraLength = randomPara.length;
  textDisplay.innerHTML = randomPara
    .split("")
    .map((char) => `<span class="char">${char}</span>`)
    .join("");
  chars = document.querySelectorAll(".char");
  characters.textContent = `0/${paraLength}`;
}
randomQs();

//starting test
function initTypingTest() {
  inputArea.disabled = false;
  inputArea.value = "";
  totalTime = 60;
  timeFunction();
  startBtn.textContent = "Test running...";
  startBtn.disabled = true;
  startBtn.classList.add("btn-disabled");
  chars = document.querySelectorAll(".char");
  chars.forEach((c) => c.classList.remove("current"));
  chars[0]?.classList.add("current");

  inputArea.focus();
}

//preventing pasting onto the input text area
inputArea.onpaste = (e) => {
  e.preventDefault();
  return false;
};

//input area logic
let inputValue;
let accuracyPercentage;
let progressBarScore;
let bestWPM = JSON.parse(localStorage.getItem("wpm")) || [];

inputArea.addEventListener("input", (e) => {
  // 1. First read all needed values
  inputValue = e.target.value;
  const newLength = inputValue.length;
  chars = document.querySelectorAll(".char");

  // 2. Perform calculations
  findWPM();
  progressBarScore = Math.min((newLength / randomPara.length) * 100, 100);

  // Reset counters
  correctWords = 0;

  // 3. Check for empty input
  if (newLength === 0) {
    requestAnimationFrame(() => {
      characters.textContent = `0/${paraLength}`;
      chars.forEach((element) => {
        element.className = "char";
      });
      chars[0]?.classList.add("current");
    });
    return;
  }

  // 4. Count correct words (read phase)
  for (let i = 0; i < newLength; i++) {
    if (inputValue[i] === randomPara[i]) {
      correctWords++;
    }
  }

  // 5. Calculate accuracy
  accuracyPercentage = Math.floor((correctWords / paraLength) * 100);

  // 6. Batch all DOM writes together
  requestAnimationFrame(() => {
    // Update progress bar
    progressFill.style.width = `${progressBarScore}%`;

    // Update character highlighting
    chars.forEach((char, i) => {
      let newClass = "char";
      if (i < newLength) {
        newClass += inputValue[i] === randomPara[i] ? " correct" : " incorrect";
      } else if (i === newLength) {
        newClass += " current";
      }
      char.className = newClass;
    });

    // Update stats
    characters.textContent = `${newLength}/${paraLength}`;
    accuracy.textContent = `${accuracyPercentage}%`;

    // Check for completion
    if (newLength === paraLength) {
      clearInterval(timeInterval);
      inputArea.disabled = true;
      completionMessage.style.display = "block";
      startBtn.textContent = "times up";
      finalStats.innerHTML = `Your Speed: <b>${wpmCalculator} wpm</b><br>
       Accuracy: <b>${accuracyPercentage}%</b><br>
       Characters Typed: <b>${newLength}/${paraLength}</b>`;
      wpmScores(wpmCalculator);
      if (bestScore === null) {
        return;
      } else {
        bestScore.style.display = "block";
        bestWPMResult.textContent = bestWPM[0];
      }
    }
  });
});
//storing score in local storage
function wpmScores(newScore) {
  const isDubplicated = bestWPM.includes(newScore);
  if (!isDubplicated) {
    bestWPM.push(newScore);
  }
  bestWPM.sort((a, b) => b - a);
  localStorage.setItem("wpm", JSON.stringify(bestWPM));
}

//start btn logic
startBtn.addEventListener("click", initTypingTest);

//reset function
function resetAll() {
  const hadContent = inputArea.value.length > 0;
  clearInterval(timeInterval);
  totalTime = 60;
  timer.textContent = `${totalTime}s`;
  inputArea.disabled = true;
  inputArea.value = "";
  characters.textContent = `0/${paraLength}`;
  startBtn.textContent = "START TEST";
  startBtn.disabled = false;
  startBtn.classList.remove("btn-disabled");
  accuracy.textContent = `0%`;
  totalCharTyped = 0;
  wpmCalculator = 0;
  findWPM();
  progressFill.style.width = `0%`;
  completionMessage.style.display = "none";

  if (hadContent > 0) {
    inputArea.disabled = true;
    inputArea.value = "";
    if (chars) {
      chars.forEach((element) => {
        element.className = "char";
      });
      chars[0]?.classList.add("current");
    }
  } else {
    inputArea.disabled = true;
    inputArea.value = "";
    randomQs();
  }
}
resetBtn.addEventListener("click", resetAll);

//calculating wpm
let totalCharTyped = 0;
let wpmCalculator = 0;
function findWPM() {
  totalCharTyped = inputArea.value.length;
  let wordsTyped = totalCharTyped / 5;
  wpmCalculator = Math.floor(wordsTyped);
  wpm.textContent = `${wpmCalculator} wpm`;
}

//clearing local storage at 12 am each night
const now = new Date();
const msToNextHour = (60 - now.getMinutes()) * 60000 - now.getSeconds() * 1000;

setTimeout(() => {
  clearAtMidnight();
  setInterval(clearAtMidnight, 3600000);
}, msToNextHour);
