import Introduction from './modules/Introduction.js';
import gsap, { SplitText } from "/scripts/greensock/esm/all.js";
import { registerGameSettings, registerHandlebars } from './modules/Setup.js';
import { setupSockets } from './modules/SocketHandler.js';
import IntroduceDialog from './modules/IntroduceDialog.js';


Hooks.once('init', () => {
    game.modules.get("introduce-me").api = {
        introduceMe: async (token) => await new Introduction().introduceMe(token, token.actor),
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

Hooks.on('renderTokenConfig', async (data, html) => {
    if($(html).parent('section').length === 0){
        const configButton = $(html).find('.window-header > .configure-sheet').first();
        const closeButton = $(html).find('.window-header > .header-button.close').first();
        const insertPoint = configButton.length > 0 ? configButton : closeButton;
        $(insertPoint).before(`<a class="introduce-me-button"><i class="fas fa-handshake"></i>${game.i18n.localize('introduceMe.actorSettings.introduceButton')}</>`);
        $('.window-header > .introduce-me-button').click(event => {
            new IntroduceDialog(data.token, data.token.actor).render(true);
        });
    }
});

Hooks.on('getActorDirectoryEntryContext', (_, entryOptions) => {
    entryOptions.push({
      name: game.i18n.localize('introduceMe.actorSettings.introduceButton'),
      callback: (li) => {
        const docId = $(li).attr("data-document-id")
        ? $(li).attr("data-document-id")
        : $(li).attr("data-actor-id")
          ? $(li).attr("data-actor-id")
          : $(li).attr("data-entity-id");

        if (docId) {
            const actor = game.actors.get(docId);
            new IntroduceDialog(actor._source.token, actor).render(true);
        }
      },
      icon: '<i class="fas fa-handshake"></i>',
      condition: () => game.user.isGM
    });
});