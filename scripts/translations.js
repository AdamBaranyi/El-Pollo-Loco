const translations = {
    en: {
        "rotate": "Turn your device to play!",
        "selectLevel": "Select Level",
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
        "impBack": "← Back to Game",
        "pauseTitle": "Paused",
        "pauseResume": "Resume",
        "howToPlayBtn": "How to Play",
        "howToPlayTitle": "How to Play",
        "howToPlayGoal": "Goal",
        "howToPlayGoalText": "Defeat El Pollo Loco, the giant chicken endboss, to win the game!",
        "howToPlayCollect": "Collect",
        "howToPlayCollectText": "Pick up coins for bonus health every 10 coins. Collect salsa bottles to use as weapons.",
        "howToPlayFight": "Fight",
        "howToPlayFightText": "Stomp on small chickens by jumping on them. Throw bottles (D) at the endboss to deal damage.",
        "howToPlayTip": "Tip",
        "howToPlayTipText": "The endboss needs 5 bottle hits to defeat. Save enough bottles before reaching him — he gets faster as his health drops!",
        "howToPlayFullscreen": "Fullscreen",
        "howToPlayFullscreenText": "Alt + Enter (Windows) or Option + Enter (Mac) or use the ⛶ button.",
        "howToPlayPause": "Pause",
        "howToPlayPauseText": "Press P or Escape or use the ⏸ button to pause. Resume or go back to the main menu from the pause screen.",
        "closeBtn": "Close"
    },
    de: {
        "rotate": "Drehe dein Gerät um zu spielen!",
        "selectLevel": "Level wählen",
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
        "impBack": "← Zurück zum Spiel",
        "pauseTitle": "Pause",
        "pauseResume": "Weiter",
        "howToPlayBtn": "Spielanleitung",
        "howToPlayTitle": "Spielanleitung",
        "howToPlayGoal": "Ziel",
        "howToPlayGoalText": "Besiege El Pollo Loco, das riesige Hühner-Endboss, um das Spiel zu gewinnen!",
        "howToPlayCollect": "Sammeln",
        "howToPlayCollectText": "Sammle Münzen für Bonus-Leben alle 10 Münzen. Sammle Salsa-Flaschen als Waffen.",
        "howToPlayFight": "Kämpfen",
        "howToPlayFightText": "Springe auf kleine Hühner um sie zu besiegen. Wirf Flaschen (D) auf den Endboss um Schaden zu machen.",
        "howToPlayTip": "Tipp",
        "howToPlayTipText": "Der Endboss braucht 5 Flaschentreffer um besiegt zu werden. Spare genug Flaschen bevor du ihn erreichst — er wird schneller je weniger Leben er hat!",
        "howToPlayFullscreen": "Vollbild",
        "howToPlayFullscreenText": "Alt + Enter (Windows) oder Option + Enter (Mac) oder ⛶ Button.",
        "howToPlayPause": "Pause",
        "howToPlayPauseText": "P oder Escape oder ⏸ Button drücken um zu pausieren. Im Pause-Menü kannst du weiterspielen oder zum Hauptmenü zurück.",
        "closeBtn": "Schließen"
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

