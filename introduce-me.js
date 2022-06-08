import Introduction from './modules/Introduction.js';
import gsap, { SplitText } from "/scripts/greensock/esm/all.js";

Hooks.once('init', () => {
    game.modules.get("introduce-me").api = {
        introduceMe: async (token) => await Introduction.introduceMe(token),
        setFlavor: Introduction.setFlavor,
    };
    gsap.registerPlugin(SplitText);
});

Hooks.on('ready', () => {
    game.socket.on(`module.introduce-me`, async request => {
        const token = await fromUuid(request.uuid);
        await Introduction.introductionDisplay(token, token._actor);
    });
});