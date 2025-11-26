const originalForm = document.querySelector("form.php-email-form.contact-form");
if (originalForm) {
  originalForm.classList.remove("php-email-form");
  originalForm.removeAttribute("action");
  originalForm.removeAttribute("method");
}

const form        = document.querySelector(".contact-form");
const output      = document.getElementById("formOutput");
const submitBtn   = document.getElementById("submitBtn");

const nameInput    = document.getElementById("userName");
const surnameInput = document.getElementById("userSurname");
const emailInput   = document.getElementById("userEmail");
const phoneInput   = document.getElementById("userPhone");
const addressInput = document.getElementById("userAddress");
const subjectInput = document.getElementById("messageSubject");
const messageInput = document.getElementById("userMessage");

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

function updateSubmitState() {
  if (!submitBtn) return;

  const requiredInputs = [nameInput, surnameInput, emailInput, subjectInput, messageInput];
  if (addressInput) requiredInputs.push(addressInput);

  const anyEmpty = requiredInputs.some(inp => !inp || !inp.value.trim());

  const errorElems = form.querySelectorAll(".validation-error");
  let anyError = false;
  errorElems.forEach(el => {
    if (el.textContent.trim() !== "") anyError = true;
  });

  submitBtn.disabled = anyEmpty || anyError;
}

nameInput   && nameInput.addEventListener("input", () => { validateNameField(nameInput, "Vardas"); updateSubmitState(); });
surnameInput&& surnameInput.addEventListener("input", () => { validateNameField(surnameInput, "Pavardė"); updateSubmitState(); });
emailInput  && emailInput.addEventListener("input", () => { validateEmail(emailInput); updateSubmitState(); });
addressInput&& addressInput.addEventListener("input", () => { validateAddress(addressInput); updateSubmitState(); });
subjectInput&& subjectInput.addEventListener("input", () => { validateNotEmpty(subjectInput, "Subject"); updateSubmitState(); });
messageInput&& messageInput.addEventListener("input", () => { validateNotEmpty(messageInput, "Žinutė"); updateSubmitState(); });

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

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const okName     = validateNameField(nameInput, "Vardas");
  const okSurname  = validateNameField(surnameInput, "Pavardė");
  const okEmail    = validateEmail(emailInput);
  const okAddress  = addressInput ? validateAddress(addressInput) : true;
  const okSubject  = validateNotEmpty(subjectInput, "Subject");
  const okMessage  = validateNotEmpty(messageInput, "Žinutė");

  updateSubmitState();

  if (submitBtn && submitBtn.disabled) {
    return;
  }

  const formData = {
    vardas:   nameInput.value,
    pavarde:  surnameInput.value,
    email:    emailInput.value,
    telefonas: phoneInput ? phoneInput.value : "",
    adresas:  addressInput ? addressInput.value : "",
    subject:  subjectInput.value,
    message:  messageInput.value,
    q1: Number(document.getElementById("q1")?.value || 0),
    q2: Number(document.getElementById("q2")?.value || 0),
    q3: Number(document.getElementById("q3")?.value || 0),
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
      <strong>Adresas:</strong> ${formData.adresas}<br>
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

updateSubmitState();
