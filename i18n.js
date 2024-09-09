i18next
  .init({
    lng: 'en', // default language
    resources: {
      en: {
        translation: {
          "intro": "Hello!, 👨‍💻 I'm Santiago, a 🛡️ cybersecurity specialist and experienced sysadmin. 🐧 I'm passionate about open-source technologies, 🔒 privacy, and 🧮 cryptography, with an active exploration of 🔗 blockchain, 🌐 web3 development, 📊 data science, and 🤖 Artificial Intelligence.",
          "helpPrompt": "Type 'help' to see available commands.",
          "easterEggHint": "Psst... there might be some hidden easter eggs commands. 🥚"
        }
      },
      es: {
        translation: {
          "intro": "¡Hola!, 👨‍💻 Soy Santiago, un especialista en 🛡️ ciberseguridad y administrador de sistemas experimentado. 🐧 Me apasionan las tecnologías de código abierto, la 🔒 privacidad y la 🧮 criptografía, con una exploración activa de 🔗 blockchain, desarrollo 🌐 web3, 📊 ciencia de datos e 🤖 Inteligencia Artificial.",
          "helpPrompt": "Escribe 'help' para ver los comandos disponibles.",
          "easterEggHint": "Psst... puede que haya algunos comandos ocultos de easter eggs. 🥚"
        }
      }
    }
  });

export function changeLanguage(lang) {
  i18next.changeLanguage(lang, (err, t) => {
    if (err) return console.log('Something went wrong loading', err);
    updateContent();
    if (window.innerWidth <= 600) {
      const terminalMenu = document.getElementById('terminal-menu');
      terminalMenu.classList.remove('active');
      const menuToggle = document.querySelector('button');
      if (menuToggle) menuToggle.textContent = '☰';
    }
  });
}

function updateContent() {
  $('body').localize();
}

$(function() {
  jqueryI18next.init(i18next, $);
  $('body').localize();
});