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
inputArea.addEventListener("input", (e) => {
  findWPM();
  inputValue = e.target.value;
  chars = document.querySelectorAll(".char");
  chars.forEach((element) => {
    element.className = "char";
  });
  if (inputValue.length === 0) {
    correctWords = 0;
    characters.textContent = `0/${paraLength}`;
    chars[0]?.classList.add("current");
    return;
  }
  correctWords = 0;
  for (let i = 0; i < chars.length; i++) {
    if (i < inputValue.length) {
      if (inputValue[i] === randomPara[i]) {
        chars[i].classList.add("correct");
        correctWords++;
      } else {
        chars[i].classList.add("incorrect");
      }
    } else if (i === inputValue.length) {
      chars[i].classList.add("current");
      break;
    }
    //accuracy calculation
    characters.textContent = `${correctWords}/${paraLength}`;
    accuracyPercentage = Math.floor((correctWords / paraLength) * 100);
    accuracy.textContent = `${accuracyPercentage}%`;
  }
});

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
  wpm.textContent = `${wpmCalculator}`;
}

//progress bar functionality
//result display
//storing result in local storage
