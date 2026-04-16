const translations = {
    en: {
        "rotate": "Turn your device to play!",
        "playLevel1": "Play (Level 1)",
        "playLevel2": "Play (Level 2)",
        "playLevel3": "Play (Level 3)",
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
        "playAgain": "Play Again",
        "impTitle": "Legal Notice",
        "impContactAddress": "Contact Address",
        "impContact": "Contact",
        "impAuthUser": "Authorized Representative",
        "impDisclaimerTitle": "Disclaimer",
        "impDisclaimerText": "This project was created as part of an apprenticeship and is solely for educational purposes. The graphics and assets used were provided by Developer Akademie.",
        "impCopyrightTitle": "Copyright",
        "impCopyrightText": "The content and works created by the site operator on these pages are subject to Swiss copyright law. Duplication, processing, distribution, or any form of commercialization of such material beyond the scope of the copyright law shall require the prior written consent of its respective author or creator.",
        "impBack": "← Back to Game"
    },
    de: {
        "rotate": "Drehe dein Gerät um zu spielen!",
        "playLevel1": "Spielen (Level 1)",
        "playLevel2": "Spielen (Level 2)",
        "playLevel3": "Spielen (Level 3)",
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
        "playAgain": "Nochmal spielen",
        "impTitle": "Impressum",
        "impContactAddress": "Kontaktadresse",
        "impContact": "Kontakt",
        "impAuthUser": "Vertretungsberechtigte Person",
        "impDisclaimerTitle": "Haftungsausschluss",
        "impDisclaimerText": "Dieses Projekt wurde im Rahmen einer Ausbildung erstellt und dient ausschließlich zu Lernzwecken. Die verwendeten Grafiken und Assets wurden vom Developer Akademie bereitgestellt.",
        "impCopyrightTitle": "Urheberrecht",
        "impCopyrightText": "Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem Schweizer Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.",
        "impBack": "← Zurück zum Spiel"
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

