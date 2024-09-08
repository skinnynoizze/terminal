import { commandStrings } from "./commandStrings.js";

const terminal = document.getElementById("terminal");
const userInput = document.getElementById("user-input");

const colorThemes = {
  "one-dark": {
    bgColor: "#282c34",
    textColor: "#abb2bf",
    promptColor: "#98c379",
    accentColor: "#61afef",
    errorColor: "#e06c75",
  },
  "solarized-dark": {
    bgColor: "#002b36",
    textColor: "#839496",
    promptColor: "#859900",
    accentColor: "#268bd2",
    errorColor: "#dc322f",
  },
  dracula: {
    bgColor: "#282a36",
    textColor: "#f8f8f2",
    promptColor: "#50fa7b",
    accentColor: "#8be9fd",
    errorColor: "#ff5555",
  },
  monokai: {
    bgColor: "#272822",
    textColor: "#f8f8f2",
    promptColor: "#a6e22e",
    accentColor: "#66d9ef",
    errorColor: "#f92672",
  },
};

function setTheme(themeName) {
  const theme = colorThemes[themeName];
  if (theme) {
    document.documentElement.style.setProperty("--bg-color", theme.bgColor);
    document.documentElement.style.setProperty("--text-color", theme.textColor);
    document.documentElement.style.setProperty(
      "--prompt-color",
      theme.promptColor
    );
    document.documentElement.style.setProperty(
      "--accent-color",
      theme.accentColor
    );
    document.documentElement.style.setProperty(
      "--error-color",
      theme.errorColor
    );
    return `Theme changed to ${themeName}`;
  } else {
    return `Theme '${themeName}' not found. Available themes: ${Object.keys(
      colorThemes
    ).join(", ")}`;
  }
}

const commands = {
  file: (args) => {
    if (args.length === 0) {
      return "File menu options: New, Open, Save, Exit";
    }
    switch (args[0].toLowerCase()) {
      case 'new':
        return "Creating a new file...";
      case 'open':
        return "Opening file...";
      case 'save':
        return "Saving file...";
      case 'exit':
        return "Exiting...";
      default:
        return `Unknown file command: ${args[0]}`;
    }
  },

  edit: () => "Edit menu options: Cut, Copy, Paste, Find",

  view: () => "View menu options: Zoom In, Zoom Out, Full Screen",

  help: () => commandStrings.help,

  contact: () => commandStrings.contact,

  about: () => commandStrings.about,

  cv: (args) => {
    if (args.length > 0 && args[0].toLowerCase() === "pdf") {
      return downloadCV();
    }
    return commandStrings.cv;
  },

  github: () => commandStrings.github,

  referrals: () => commandStrings.referrals,

  clear: () => {
    const outputs = terminal.getElementsByClassName("output");
    while (outputs.length > 0) {
      outputs[0].remove();
    }
    return "";
  },

  theme: (args) => {
    if (args.length === 0) {
      return commandStrings.theme;
    }
    return setTheme(args[0]);
  },
};

const availableCommands = Object.keys(commands);

function getCompletions(input) {
  const [command, ...args] = input.split(" ");
  if (args.length === 0) {
    // Complete commands
    return availableCommands.filter((cmd) => cmd.startsWith(command));
  } else if (command === "theme") {
    // Complete theme names
    const themeArg = args[args.length - 1];
    return Object.keys(colorThemes).filter((theme) =>
      theme.startsWith(themeArg)
    );
  }
  // Add more argument completions for other commands as needed
  return [];
}

let commandHistory = [];
let historyIndex = -1;
let completions = [];
let completionIndex = 0;

function checkEasterEggs(cmd) {
  const lowerCmd = cmd.toLowerCase();
  switch (lowerCmd) {
    case "sudo":
      return "Nice try, but you don't have root access here!";
    case "exit":
      return "There is no escape. You're stuck with me forever!";
    case "coffee":
      return "☕ Here's your virtual coffee. Now back to coding!";
    case "matrix":
      return startMatrixEffect();
    case "konami":
      return "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️ Cheat mode activated!";
    case "42":
      return "Yes, that's the answer to life, the universe, and everything.";
    case "ping":
      return "Pong!";
    case "hello world":
      return "Hello, programmer! Ready to code?";
    case "roll":
      document.body.style.animation = "roll 4s 1";
      return "Wheee!";
    case "party":
      return startPartyMode();
    default:
      return null;
  }
}

function processCommand(cmd) {
  const easterEgg = checkEasterEggs(cmd);
  if (easterEgg) {
    return easterEgg;
  }

  const [command, ...args] = cmd.trim().toLowerCase().split(" ");
  if (commands[command]) {
    return commands[command](args);
  } else {
    return `Command not found: ${command}. Type 'help' for available commands.`;
  }
}

function downloadCV() {
  // In a real scenario, you would have an actual PDF file to download
  const pdfUrl = "path/to/your/cv.pdf";
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = "John_Doe_CV.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return "Downloading CV as PDF...";
}

userInput.addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    event.preventDefault();

    const input = this.value;
    if (completions.length === 0) {
      completions = getCompletions(input);
      completionIndex = 0;
    }

    if (completions.length > 0) {
      const completion = completions[completionIndex];
      const [command, ...args] = input.split(" ");
      if (args.length === 0) {
        this.value = completion;
      } else {
        args[args.length - 1] = completion;
        this.value = [command, ...args].join(" ");
      }
      completionIndex = (completionIndex + 1) % completions.length;
    }
  } else if (event.key !== "Enter") {
    completions = [];
    completionIndex = 0;
  }

  // Existing arrow key handling code
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();

    if (event.key === "ArrowUp" && historyIndex < commandHistory.length - 1) {
      historyIndex++;
    } else if (event.key === "ArrowDown" && historyIndex > -1) {
      historyIndex--;
    }

    if (historyIndex >= 0) {
      this.value = commandHistory[historyIndex];
    } else {
      this.value = "";
    }
  }
});

userInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const cmd = this.value.trim();
    if (cmd) {
      commandHistory.unshift(cmd);
      historyIndex = -1;
    }
    this.value = "";

    const outputDiv = document.createElement("div");
    outputDiv.className = "output";
    outputDiv.innerHTML = `<span style="color: var(--prompt-color);">guest@portfolio:~$</span> ${cmd}`;
    terminal.insertBefore(outputDiv, terminal.lastElementChild);

    const result = processCommand(cmd);
    const resultDiv = document.createElement("div");
    resultDiv.className = "output";
    resultDiv.innerHTML = result;
    terminal.insertBefore(resultDiv, terminal.lastElementChild);

    terminal.scrollTop = terminal.scrollHeight;
  }
});

function startMatrixEffect() {
  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = "block";

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+";
  const fontSize = 10;
  const columns = canvas.width / fontSize;
  const drops = [];

  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
    }
  }

  const matrixInterval = setInterval(draw, 33);

  // Stop the effect after 10 seconds
  setTimeout(() => {
    clearInterval(matrixInterval);
    canvas.style.display = "none";
  }, 10000);

  return "Look around, Neo. It's nothing like the world you know. But then, neither is the Matrix.";
}

function startPartyMode() {
  document.body.style.animation = "disco 1s infinite";
  setTimeout(() => {
    document.body.style.animation = "";
  }, 5000);
  return "🎉🕺💃 Party mode activated for 5 seconds! 🎊🥳🎈";
}

document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('#terminal-menu nav ul li a');
  const terminalMenu = document.getElementById('terminal-menu');
  const menuToggle = document.createElement('button');
  
  function closeMenu() {
    terminalMenu.classList.remove('active');
    menuToggle.textContent = '☰';
  }

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const command = e.target.getAttribute('data-command');
      
      if (command) {
        e.preventDefault();
        const userInput = document.getElementById('user-input');
        userInput.value = command;
        userInput.focus();
        
        // Simulate Enter key press
        const enterEvent = new KeyboardEvent('keyup', {
          key: 'Enter',
          bubbles: true,
          cancelable: true
        });
        userInput.dispatchEvent(enterEvent);
      }
      
      // Close the menu after clicking a link or command
      if (window.innerWidth <= 600) {
        closeMenu();
      }
    });
  });

  // Add menu toggle functionality for mobile devices
  menuToggle.textContent = '☰';
  menuToggle.style.cssText = `
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 20px;
    cursor: pointer;
    display: none;
    position: fixed;
    right: 10px;
    top: 10px;
    z-index: 1002;
  `;

  document.body.appendChild(menuToggle);

  menuToggle.addEventListener('click', () => {
    terminalMenu.classList.toggle('active');
    menuToggle.textContent = terminalMenu.classList.contains('active') ? '✕' : '☰';
  });

  // Handle submenu toggles on mobile
  const hasSubmenuItems = document.querySelectorAll('#terminal-menu .has-submenu > a');
  hasSubmenuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (window.innerWidth <= 600) {
        e.preventDefault();
        item.parentElement.classList.toggle('active');
      }
    });
  });

  // Show/hide menu toggle based on screen width
  function toggleMenuButton() {
    if (window.innerWidth <= 600) {
      menuToggle.style.display = 'block';
    } else {
      menuToggle.style.display = 'none';
      closeMenu();
    }
  }

  window.addEventListener('resize', toggleMenuButton);
  toggleMenuButton(); // Initial call
});
