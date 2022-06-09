import Introduction from './modules/Introduction.js';
import gsap, { SplitText } from "/scripts/greensock/esm/all.js";

Hooks.once('init', () => {
    game.modules.get("introduce-me").api = {
        introduceMe: async (token) => await Introduction.introduceMe(token),
        introduceDialog: Introduction.introduceMeDialog,
    };
    gsap.registerPlugin(SplitText);

    game.settings.register('introduce-me', 'show-hud', {
        name: 'Show HUD',
        hint: 'If HUD is not displayed then use the module macros to access the functionality instead.',
        scope: 'world',
        default: true,
        config: true,
        type: Boolean,
    });
});

Hooks.on('ready', () => {
    game.socket.on(`module.introduce-me`, async request => {
        const token = await fromUuid(request.uuid);
        await Introduction.introductionDisplay(token, token._actor);
    });
});

Hooks.on('renderTokenHUD', async (data, html) => {
    if(game.user.isGM && game.settings.get('introduce-me', 'show-hud')){
        await Introduction.renderHUD(data, html);
    }
});