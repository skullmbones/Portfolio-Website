window.renderTerminalLine = function () {
  const line = document.getElementById("terminal-line");
  const cwd = terminalState.cwd;

  let html = "";

  if (cwd === "~") {
    html += `michaelbabboni@Portfolio %`;
  } else {
    const dir = cwd.replace("~/", "");
    html += `michaelbabboni@Portfolio/<span class="path" onclick="goUp()">${dir}</span> % `;
  }

  const entries = fs[cwd] || [];

  entries.forEach(name => {
    const isRoot = cwd === "~";
    const cmd = isRoot ? `/${name}` : `./${name}`;
    const cls = isRoot ? "dir" : "exec";

    html += ` <span class="${cls}" onclick="runCommand('${cmd}')">${cmd}</span> `;
  });

  line.innerHTML = html;
};

renderTerminalLine();

