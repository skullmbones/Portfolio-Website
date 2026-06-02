window.runCommand = function (cmd) {
  if (cmd === "/projects") {
    terminalState.set("~/projects");
    return;
  }

  if (cmd === "/about") {
    terminalState.set("~/about");
    return;
  }

  if (cmd.startsWith("./")) {
    const name = cmd.replace("./", "");
    logTerminal(`loading ${name}...`, "log-loading");
    openProjectWindow(name);
  }
};

window.goUp = function () {
  terminalState.set("~");
};
