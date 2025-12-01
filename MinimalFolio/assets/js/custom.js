const originalForm = document.querySelector("form.php-email-form.contact-form");
if (originalForm) {
  originalForm.classList.remove("php-email-form");
  originalForm.removeAttribute("action");
  originalForm.removeAttribute("method");
}

const form = document.querySelector(".contact-form");
const output = document.getElementById("formOutput");
const submitBtn = document.getElementById("submitBtn");

const nameInput = document.getElementById("userName");
const surnameInput = document.getElementById("userSurname");
const emailInput = document.getElementById("userEmail");
const phoneInput = document.getElementById("userPhone");
const addressInput = document.getElementById("userAddress");
const subjectInput = document.getElementById("messageSubject");
const messageInput = document.getElementById("userMessage");

const q1Input = document.getElementById("q1");
const q2Input = document.getElementById("q2");
const q3Input = document.getElementById("q3");

function showError(input, message) {
  if (!input) return;
  input.style.borderColor = "red";
  let errorSpan = input.parentElement.querySelector(".validation-error");
  if (!errorSpan) {
    errorSpan = document.createElement("div");
    errorSpan.className = "validation-error";
    errorSpan.style.color = "red";
    errorSpan.style.fontSize = "12px";
    errorSpan.style.marginTop = "4px";
    input.parentElement.appendChild(errorSpan);
  }
  errorSpan.textContent = message;
}

function clearError(input) {
  if (!input) return;
  input.style.borderColor = "";
  const errorSpan = input.parentElement.querySelector(".validation-error");
  if (errorSpan) {
    errorSpan.textContent = "";
  }
}

function validateNotEmpty(input, labelText = "Šis laukas") {
  if (!input) return true;
  if (!input.value.trim()) {
    showError(input, `${labelText} yra privalomas.`);
    return false;
  }
  clearError(input);
  return true;
}

function validateNameField(input, labelText) {
  if (!validateNotEmpty(input, labelText)) return false;
  const nameRegex = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s-]+$/;
  if (!nameRegex.test(input.value.trim())) {
    showError(input, `${labelText} turi būti sudarytas tik iš raidžių.`);
    return false;
  }
  clearError(input);
  return true;
}

function validateEmail(input) {
  if (!validateNotEmpty(input, "El. paštas")) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.value.trim())) {
    showError(input, "Neteisingas el. pašto formatas.");
    return false;
  }
  clearError(input);
  return true;
}

function validateAddress(input) {
  return validateNotEmpty(input, "Adresas");
}

function validateRating(input, labelText = "Vertinimas") {
  if (!input) return true;
  const value = Number(input.value);
  if (Number.isNaN(value) || value < 1 || value > 10) {
    showError(input, `${labelText} turi būti tarp 1 ir 10.`);
    return false;
  }
  clearError(input);
  return true;
}

function updateSubmitState() {
  if (!submitBtn || !form) return;
  const requiredInputs = [nameInput, surnameInput, emailInput, subjectInput, messageInput];
  if (addressInput) requiredInputs.push(addressInput);
  if (q1Input) requiredInputs.push(q1Input);
  if (q2Input) requiredInputs.push(q2Input);
  if (q3Input) requiredInputs.push(q3Input);
  const anyEmpty = requiredInputs.some(inp => !inp || !inp.value.toString().trim());
  const errorElems = form.querySelectorAll(".validation-error");
  let anyError = false;
  errorElems.forEach(el => {
    if (el.textContent.trim() !== "") anyError = true;
  });
  submitBtn.disabled = anyEmpty || anyError;
}

if (nameInput) {
  nameInput.addEventListener("input", () => {
    validateNameField(nameInput, "Vardas");
    updateSubmitState();
  });
}

if (surnameInput) {
  surnameInput.addEventListener("input", () => {
    validateNameField(surnameInput, "Pavardė");
    updateSubmitState();
  });
}

if (emailInput) {
  emailInput.addEventListener("input", () => {
    validateEmail(emailInput);
    updateSubmitState();
  });
}

if (addressInput) {
  addressInput.addEventListener("input", () => {
    validateAddress(addressInput);
    updateSubmitState();
  });
}

if (subjectInput) {
  subjectInput.addEventListener("input", () => {
    validateNotEmpty(subjectInput, "Subject");
    updateSubmitState();
  });
}

if (messageInput) {
  messageInput.addEventListener("input", () => {
    validateNotEmpty(messageInput, "Žinutė");
    updateSubmitState();
  });
}

if (q1Input) {
  q1Input.addEventListener("input", () => {
    validateRating(q1Input, "Vertinimas 1");
    updateSubmitState();
  });
}

if (q2Input) {
  q2Input.addEventListener("input", () => {
    validateRating(q2Input, "Vertinimas 2");
    updateSubmitState();
  });
}

if (q3Input) {
  q3Input.addEventListener("input", () => {
    validateRating(q3Input, "Vertinimas 3");
    updateSubmitState();
  });
}

if (phoneInput) {
  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value.trim()) {
      phoneInput.value = "+370 ";
    }
  });
  phoneInput.addEventListener("input", () => {
    let digits = phoneInput.value.replace(/\D/g, "");
    if (digits.startsWith("370")) {
      digits = digits.slice(3);
    }
    digits = digits.slice(0, 8);
    if (digits.length > 0 && digits[0] !== "6") {
      digits = "6" + digits.slice(1);
    }
    const part1 = digits.substring(0, 1);
    const part2 = digits.substring(1, 4);
    const part3 = digits.substring(4, 8);
    let formatted = "+370";
    if (part1) formatted += " " + part1;
    if (part2) formatted += part2;
    if (part3) formatted += " " + part3;
    phoneInput.value = formatted;
  });
}

function showSuccessPopup(message) {
  let popup = document.getElementById("successPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "successPopup";
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.padding = "15px 20px";
    popup.style.backgroundColor = "#28a745";
    popup.style.color = "#fff";
    popup.style.borderRadius = "4px";
    popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    popup.style.zIndex = "9999";
    popup.style.fontWeight = "600";
    popup.style.display = "none";
    document.body.appendChild(popup);
  }
  popup.textContent = message;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}

if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const okName = validateNameField(nameInput, "Vardas");
    const okSurname = validateNameField(surnameInput, "Pavardė");
    const okEmail = validateEmail(emailInput);
    const okAddress = addressInput ? validateAddress(addressInput) : true;
    const okSubject = validateNotEmpty(subjectInput, "Subject");
    const okMessage = validateNotEmpty(messageInput, "Žinutė");
    const okQ1 = validateRating(q1Input, "Vertinimas 1");
    const okQ2 = validateRating(q2Input, "Vertinimas 2");
    const okQ3 = validateRating(q3Input, "Vertinimas 3");
    updateSubmitState();
    if (submitBtn && submitBtn.disabled) {
      return;
    }
    if (!okName || !okSurname || !okEmail || !okAddress || !okSubject || !okMessage || !okQ1 || !okQ2 || !okQ3) {
      return;
    }
    const formData = {
      vardas: nameInput ? nameInput.value : "",
      pavarde: surnameInput ? surnameInput.value : "",
      email: emailInput ? emailInput.value : "",
      telefonas: phoneInput ? phoneInput.value : "",
      adresas: addressInput ? addressInput.value : "",
      subject: subjectInput ? subjectInput.value : "",
      message: messageInput ? messageInput.value : "",
      q1: Number(q1Input ? q1Input.value : 0),
      q2: Number(q2Input ? q2Input.value : 0),
      q3: Number(q3Input ? q3Input.value : 0)
    };
    console.log("Formos duomenys:", formData);
    const average = (formData.q1 + formData.q2 + formData.q3) / 3;
    if (output) {
      output.style.display = "block";
      output.innerHTML = `
      <strong>Vardas:</strong> ${formData.vardas}<br>
      <strong>Pavardė:</strong> ${formData.pavarde}<br>
      <strong>El. paštas:</strong> ${formData.email}<br>
      <strong>Tel. numeris:</strong> ${formData.telefonas}<br>
      <strong>Subject:</strong> ${formData.subject}<br>
      <strong>Žinutė:</strong> ${formData.message}<br><br>
      <strong>Vertinimas 1:</strong> ${formData.q1}/10<br>
      <strong>Vertinimas 2:</strong> ${formData.q2}/10<br>
      <strong>Vertinimas 3:</strong> ${formData.q3}/10<br><br>
      <strong>Vidutinis įvertinimas:</strong> ${average.toFixed(2)}
    `;
    }
    showSuccessPopup("Duomenys pateikti sėkmingai!");
  });
}

updateSubmitState();

let contactSection = document.getElementById("contact");
if (!contactSection) contactSection = document.querySelector(".contact");
if (!contactSection) contactSection = document.querySelector("section.contact");

let gameSection = document.getElementById("game-section");
if (!gameSection) {
  gameSection = document.createElement("section");
  gameSection.id = "game-section";
  if (contactSection && contactSection.parentNode) {
    contactSection.parentNode.insertBefore(gameSection, contactSection.nextSibling);
  } else {
    document.body.appendChild(gameSection);
  }
}

gameSection.innerHTML = `
  <div class="game-wrapper">
    <h2 class="game-title">Mano Žaidimas</h2>

    <div class="game-controls">
      <label for="gameDifficulty">Sudėtingumo lygis:</label>
      <select id="gameDifficulty">
        <option value="easy">Lengvas (4×3)</option>
        <option value="hard">Sunkus (6×4)</option>
      </select>
      <button id="gameStartBtn">Start</button>
      <button id="gameResetBtn">Atnaujinti</button>
    </div>

    <div class="game-layout">
      <div id="gameBoard" class="game-board"></div>

      <div class="game-sidebar">
        <div class="game-stats">
          <div>Ėjimai: <span id="gameMoves">0</span></div>
          <div>Sutapusių porų skaičius: <span id="gameMatches">0</span></div>
          <div>Laikas: <span id="gameTimer">00:00</span></div>
        </div>
        <div class="game-best">
          <div>Geriausias rezultatas (Lengvas): <span id="bestEasy">-</span></div>
          <div>Geriausias rezultatas (Sunkus): <span id="bestHard">-</span></div>
        </div>
        <div id="gameMessage" class="game-message"></div>
      </div>
    </div>
  </div>
`;

gameSection.style.padding = "60px 0";
gameSection.style.backgroundColor = "#f7f8fa";

const gameWrapper = gameSection.querySelector(".game-wrapper");
if (gameWrapper) {
  gameWrapper.style.maxWidth = "1000px";
  gameWrapper.style.margin = "0 auto";
  gameWrapper.style.textAlign = "center";
}

const gameTitle = gameSection.querySelector(".game-title");
if (gameTitle) {
  gameTitle.style.fontSize = "32px";
  gameTitle.style.marginBottom = "20px";
}

const gameControls = gameSection.querySelector(".game-controls");
if (gameControls) {
  gameControls.style.display = "flex";
  gameControls.style.flexWrap = "wrap";
  gameControls.style.gap = "10px";
  gameControls.style.justifyContent = "center";
  gameControls.style.alignItems = "center";
  gameControls.style.marginBottom = "20px";
}

const gameLayout = gameSection.querySelector(".game-layout");
if (gameLayout) {
  gameLayout.style.display = "flex";
  gameLayout.style.flexWrap = "wrap";
  gameLayout.style.gap = "20px";
  gameLayout.style.justifyContent = "center";
  gameLayout.style.alignItems = "flex-start";
}

const gameSidebar = gameSection.querySelector(".game-sidebar");
if (gameSidebar) {
  gameSidebar.style.minWidth = "220px";
  gameSidebar.style.textAlign = "left";
}

const gameStats = gameSection.querySelector(".game-stats");
if (gameStats) {
  gameStats.style.display = "flex";
  gameStats.style.flexDirection = "column";
  gameStats.style.gap = "6px";
  gameStats.style.marginBottom = "12px";
}

const gameBest = gameSection.querySelector(".game-best");
if (gameBest) {
  gameBest.style.display = "flex";
  gameBest.style.flexDirection = "column";
  gameBest.style.gap = "4px";
  gameBest.style.fontSize = "14px";
  gameBest.style.marginBottom = "10px";
}

const gameMessage = document.getElementById("gameMessage");
if (gameMessage) {
  gameMessage.style.marginTop = "10px";
  gameMessage.style.fontWeight = "600";
}

const gameBoard = document.getElementById("gameBoard");
const gameDifficultySelect = document.getElementById("gameDifficulty");
const gameStartBtn = document.getElementById("gameStartBtn");
const gameResetBtn = document.getElementById("gameResetBtn");
const gameMovesSpan = document.getElementById("gameMoves");
const gameMatchesSpan = document.getElementById("gameMatches");
const gameTimerSpan = document.getElementById("gameTimer");
const bestEasySpan = document.getElementById("bestEasy");
const bestHardSpan = document.getElementById("bestHard");

const gameSymbols = [
  "🍎", "🍌", "🍒", "🍇", "🍉", "🍋",
  "🥝", "🍑", "🍍", "🥥", "🍓", "🥭"
];

const BEST_RESULTS_KEY = "manoGameBestResults";

let gameFirstCard = null;
let gameSecondCard = null;
let gameLockBoard = false;
let gameMoves = 0;
let gameMatches = 0;
let gameTotalPairs = 0;
let currentDifficulty = "easy";
let timerSeconds = 0;
let timerInterval = null;
let gameStarted = false;
let bestResults = loadBestResults();

function loadBestResults() {
  const raw = localStorage.getItem(BEST_RESULTS_KEY);
  if (!raw) return { easy: null, hard: null };
  try {
    const parsed = JSON.parse(raw);
    return {
      easy: typeof parsed.easy === "number" ? parsed.easy : null,
      hard: typeof parsed.hard === "number" ? parsed.hard : null
    };
  } catch (e) {
    return { easy: null, hard: null };
  }
}

function saveBestResults() {
  localStorage.setItem(BEST_RESULTS_KEY, JSON.stringify(bestResults));
}

function updateBestResultsUI() {
  if (bestEasySpan) bestEasySpan.textContent = bestResults.easy != null ? bestResults.easy : "-";
  if (bestHardSpan) bestHardSpan.textContent = bestResults.hard != null ? bestResults.hard : "-";
}

function getSettingsByDifficulty(diff) {
  if (diff === "hard") {
    return { cols: 6, rows: 4, pairs: 12 };
  }
  return { cols: 4, rows: 3, pairs: 6 };
}

function createShuffledDeck(pairCount) {
  const symbols = gameSymbols.slice(0, pairCount);
  const deck = [];
  symbols.forEach(sym => {
    deck.push({ value: sym });
    deck.push({ value: sym });
  });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
}

function resetGameState() {
  gameFirstCard = null;
  gameSecondCard = null;
  gameLockBoard = false;
  gameMoves = 0;
  gameMatches = 0;
  gameTotalPairs = 0;
  if (gameMovesSpan) gameMovesSpan.textContent = "0";
  if (gameMatchesSpan) gameMatchesSpan.textContent = "0";
  if (gameMessage) gameMessage.textContent = "";
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const mm = m < 10 ? "0" + m : String(m);
  const ss = s < 10 ? "0" + s : String(s);
  return mm + ":" + ss;
}

function resetTimer() {
  timerSeconds = 0;
  if (gameTimerSpan) gameTimerSpan.textContent = formatTime(timerSeconds);
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerSeconds += 1;
    if (gameTimerSpan) gameTimerSpan.textContent = formatTime(timerSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function createGameBoard() {
  if (!gameBoard) return;
  resetGameState();
  const diff = currentDifficulty;
  const settings = getSettingsByDifficulty(diff);
  const deck = createShuffledDeck(settings.pairs);
  gameTotalPairs = settings.pairs;
  gameBoard.innerHTML = "";
  gameBoard.style.display = "grid";
  gameBoard.style.gridTemplateColumns = `repeat(${settings.cols}, 90px)`;
  gameBoard.style.gap = "12px";
  gameBoard.style.justifyContent = "center";
  gameBoard.style.alignItems = "center";
  gameBoard.style.margin = "0 auto";
  deck.forEach((cardData, index) => {
    const card = document.createElement("button");
    card.className = "game-card";
    card.dataset.value = cardData.value;
    card.dataset.index = String(index);
    card.textContent = "";
    card.style.width = "90px";
    card.style.height = "90px";
    card.style.borderRadius = "10px";
    card.style.border = "1px solid #ccc";
    card.style.cursor = "pointer";
    card.style.backgroundColor = "#ffffff";
    card.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.fontSize = "34px";
    card.style.transition = "transform 0.2s, box-shadow 0.2s, background-color 0.2s";
    card.addEventListener("mouseover", () => {
      if (!card.disabled) {
        card.style.transform = "translateY(-3px)";
        card.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
      }
    });
    card.addEventListener("mouseout", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
    });
    card.addEventListener("click", () => handleCardClick(card));
    gameBoard.appendChild(card);
  });
}

function updateGameStats() {
  if (gameMovesSpan) gameMovesSpan.textContent = String(gameMoves);
  if (gameMatchesSpan) gameMatchesSpan.textContent = String(gameMatches);
}

function handleCardClick(card) {
  if (!gameStarted) return;
  if (gameLockBoard) return;
  if (card === gameFirstCard) return;
  if (card.disabled) return;
  revealCard(card);
  if (!gameFirstCard) {
    gameFirstCard = card;
    return;
  }
  gameSecondCard = card;
  gameLockBoard = true;
  gameMoves += 1;
  updateGameStats();
  checkCardsMatch();
}

function revealCard(card) {
  card.textContent = card.dataset.value || "";
  card.classList.add("flipped");
  card.style.backgroundColor = "#e3f2fd";
}

function hideCard(card) {
  card.textContent = "";
  card.classList.remove("flipped");
  card.style.backgroundColor = "#ffffff";
}

function checkCardsMatch() {
  if (!gameFirstCard || !gameSecondCard) {
    gameLockBoard = false;
    return;
  }
  const isMatch = gameFirstCard.dataset.value === gameSecondCard.dataset.value;
  if (isMatch) {
    gameFirstCard.disabled = true;
    gameSecondCard.disabled = true;
    gameMatches += 1;
    updateGameStats();
    resetTurn();
    checkWin();
  } else {
    setTimeout(() => {
      hideCard(gameFirstCard);
      hideCard(gameSecondCard);
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  gameFirstCard = null;
  gameSecondCard = null;
  gameLockBoard = false;
}

function updateBestForCurrentDifficulty() {
  if (gameMoves === 0) return;
  if (currentDifficulty === "easy") {
    if (bestResults.easy == null || gameMoves < bestResults.easy) {
      bestResults.easy = gameMoves;
      saveBestResults();
      updateBestResultsUI();
    }
  } else if (currentDifficulty === "hard") {
    if (bestResults.hard == null || gameMoves < bestResults.hard) {
      bestResults.hard = gameMoves;
      saveBestResults();
      updateBestResultsUI();
    }
  }
}

function checkWin() {
  if (gameMatches === gameTotalPairs) {
    stopTimer();
    gameStarted = false;
    if (gameMessage) {
      gameMessage.textContent = "Laimėjote! Viso ėjimų: " + gameMoves + ", laikas: " + formatTime(timerSeconds);
    }
    updateBestForCurrentDifficulty();
  }
}

function onDifficultyChange() {
  currentDifficulty = gameDifficultySelect ? gameDifficultySelect.value : "easy";
  gameStarted = false;
  stopTimer();
  resetTimer();
  createGameBoard();
}

function onStartGame() {
  currentDifficulty = gameDifficultySelect ? gameDifficultySelect.value : "easy";
  gameStarted = true;
  resetTimer();
  createGameBoard();
  startTimer();
}

function onResetGame() {
  gameStarted = false;
  stopTimer();
  resetTimer();
  createGameBoard();
}

if (gameDifficultySelect) {
  gameDifficultySelect.value = "easy";
  currentDifficulty = "easy";
  gameDifficultySelect.addEventListener("change", onDifficultyChange);
}

if (gameStartBtn) {
  gameStartBtn.addEventListener("click", onStartGame);
}

if (gameResetBtn) {
  gameResetBtn.addEventListener("click", onResetGame);
}

updateBestResultsUI();
resetTimer();
createGameBoard();



