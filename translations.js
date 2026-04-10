const translations = {
    en: {
        "rotate": "Turn your device to play!",
        "playLevel1": "Play (Level 1)",
        "playLevel2": "Play (Level 2)",
        "controlsBtn": "Controls",
        "imprint": "Imprint",
        "controlsTitle": "Controls",
        "walk": "Walk",
        "jump": "Jump",
        "throw": "Throw Bottle",
        "gameOverTitle": "Game Over!",
        "restart": "Restart",
        "home": "Home",
        "winTitle": "You won!",
        "nextLevel": "Next Level",
        "playAgain": "Play Again"
    },
    de: {
        "rotate": "Drehe dein Gerät um zu spielen!",
        "playLevel1": "Spielen (Level 1)",
        "playLevel2": "Spielen (Level 2)",
        "controlsBtn": "Steuerung",
        "imprint": "Impressum",
        "controlsTitle": "Steuerung",
        "walk": "Laufen",
        "jump": "Springen",
        "throw": "Flasche werfen",
        "gameOverTitle": "Game Over!",
        "restart": "Neu starten",
        "home": "Zum Start",
        "winTitle": "Du hast gewonnen!",
        "nextLevel": "Nächstes Level",
        "playAgain": "Nochmal spielen"
    }
};

let currentLanguage = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    applyTranslations();
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.innerText = translations[currentLanguage][key];
        }
    });
}

window.addEventListener('DOMContentLoaded', applyTranslations);
