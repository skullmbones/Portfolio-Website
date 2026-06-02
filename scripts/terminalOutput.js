window.logTerminal = function (text, cls = "") {
  const out = document.getElementById("terminal-output");
  const line = document.createElement("div");
  line.className = `terminal-log ${cls}`;
  line.textContent = text;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
};
