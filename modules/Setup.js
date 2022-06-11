import ColorSettings, { DefaultColors } from './ColorSettings.js';

export const registerGameSettings = () => {
    game.settings.registerMenu("introduce-me", "color-settings", {
        name: game.i18n.localize('introduceMe.colorSettings.name'),
        label: game.i18n.localize('introduceMe.colorSettings.label'),
        hint: "",
        icon: "fas fa-palette",
        type: ColorSettings,
        restricted: true
    });

    game.settings.register('introduce-me', 'show-hud', {
        name: 'Show HUD',
        hint: 'If HUD is not displayed then use the module macros to access the functionality instead.',
        scope: 'world',
        default: true,
        config: true,
        type: Boolean,
    });

    game.settings.register('introduce-me', 'introduction-duration', {
        name: 'Default Introduction Duration ',
        hint: 'The default duration in seconds that the Introduction stays after the animation finishes before being removed.',
        scope: 'world',
        default: 2,
        config: true,
        type: Number,
    });

    game.settings.register('introduce-me', 'introduction-colors', {
        name: 'Introduction Colors',
        scope: 'world',
        default: DefaultColors,
        config: false,
        type: Object,
    });
};

export const registerHandlebars = () => {
    loadTemplates([
        'modules/introduce-me/templates/partials/colorSetting.hbs',
    ]);
}