const aboutBtn = document.getElementById("about-btn");
const overlay = document.getElementById("terminal-overlay");
const terminal = document.getElementById("terminal");
const termText = document.getElementById("terminal-text");
const closeBtn = document.getElementById("terminal-close");

let stopTyping = false;

const lines = [
  "Name: Michael Babboni",
  "Major: Computer Science",
  "Minor: Music Technology",
  "School: Rutgers University-New Brunswick",
  "Graduation: expected May 2026",
  "Focus: Software Engineer and Game Development",
  "Hobbies: Playing guitar, composing music, competitive gaming, live streaming, dancing",
  "Goals: Become a well-rounded coder and land a position where I can make a positive impact through technology.",
];

const delays = {
  "Loading profile...": 800,
};

function typeLines(lines, idx = 0) {
  if (stopTyping || idx >= lines.length) return;

  let line = lines[idx];
  let i = 0;

  function typeChar() {
    if (stopTyping) return;

    if (i < line.length) {
      termText.textContent += line[i];
      i++;
      setTimeout(typeChar, 20);
    } else {
      termText.textContent += "\n";

      const extraDelay = delays[line] || 0;
      setTimeout(() => typeLines(lines, idx + 1), 120 + extraDelay);
    }
  }

  typeChar();
}

aboutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  stopTyping = false;
  termText.textContent = "";

  overlay.style.display = "flex";

  requestAnimationFrame(() => {
    terminal.classList.add("open");
  });

  typeLines(lines);
});

closeBtn.addEventListener("click", () => {
    terminal.classList.remove("open"); // start closing animation
  
    setTimeout(() => {
      overlay.style.display = "none";
    }, 280); // match transition time
  });
