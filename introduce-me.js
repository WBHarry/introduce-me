import Introduction from './modules/Introduction.js';
import gsap, { SplitText } from "/scripts/greensock/esm/all.js";

Hooks.once('init', () => {
    game.modules.get("introduce-me").api = {
        introduceMe: Introduction.introduceMe,
        setFlavor: Introduction.setFlavor,
    };
    gsap.registerPlugin(SplitText);
});