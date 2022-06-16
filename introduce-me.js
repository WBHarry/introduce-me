import Introduction from './modules/Introduction.js';
import gsap, { SplitText } from "/scripts/greensock/esm/all.js";
import { registerGameSettings, registerHandlebars } from './modules/Setup.js';
import { setupSockets } from './modules/SocketHandler.js';

Hooks.once('init', () => {
    game.modules.get("introduce-me").api = {
        introduceMe: async (token) => await new Introduction().introduceMe(token),
        introduceDialog: new Introduction().introduceMeDialog,
    };
    gsap.registerPlugin(SplitText);

    registerGameSettings();
    registerHandlebars();
});

Hooks.on('ready', async () => {
    await setupSockets();
});

Hooks.on('renderTokenHUD', async (data, html) => {
    if(game.user.isGM && game.settings.get('introduce-me', 'show-hud')){
        await new Introduction().renderHUD(data, html);
    }
});