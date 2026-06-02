const desktop = document.getElementById("desktop");
let z = 10;

window.openWindow = function ({id, title, content, cwd}){
  if (document.getElementById(id)) return;

  const win = document.createElement("div");
  win.className = "window";
  win.id = id;
  win.style.zIndex = z++;

  win.innerHTML = `
    <div class="window-header">
      <span>${title}</span>
      <span class="close">✕</span>
    </div>
    <div class="window-body">loading...</div>
  `;

  fetch(content)
    .then(r => r.text())
    .then(html => win.querySelector(".window-body").innerHTML = html);

  win.querySelector(".close").onclick = () => {
    win.remove();
    terminalState.set("~");
  };

  makeDraggable(win);
  desktop.appendChild(win);

  win.style.left = Math.random() * 300 + "px";
  win.style.top = Math.random() * 200 + "px";

  terminalState.set(cwd);
}

window.openProjectWindow = function (name) {
  const id = `window-${name}`;

  const existing = document.getElementById(id);
  if (existing) {
    // Bring existing window to front
    existing.style.zIndex = z++;
    return;
  }

  openWindow({
    id,
    title: name,
    content: `projects/${name}.html`,
    cwd: terminalState.cwd
  });
};


function makeDraggable(win) {
  const bar = win.querySelector(".window-header");
  let dx = 0, dy = 0, dragging = false;

  bar.onmousedown = e => {
    dragging = true;
    dx = e.clientX - win.offsetLeft;
    dy = e.clientY - win.offsetTop;
    win.style.zIndex = z++;
  };

  document.onmousemove = e => {
    if (!dragging) return;
    win.style.left = e.clientX - dx + "px";
    win.style.top = e.clientY - dy + "px";
  };

  document.onmouseup = () => dragging = false;
}
