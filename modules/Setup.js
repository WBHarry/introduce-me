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
        name: game.i18n.localize('introduceMe.gameSettings.showHud.name'),
        hint: game.i18n.localize('introduceMe.gameSettings.showHud.hint'),
        scope: 'world',
        default: true,
        config: true,
        type: Boolean,
    });
    
    game.settings.register('introduce-me', 'use-token', {
        name: game.i18n.localize('introduceMe.gameSettings.useToken.name'),
        hint: game.i18n.localize('introduceMe.gameSettings.useToken.hint'),
        scope: 'world',
        default: false,
        config: true,
        type: Boolean,
    });

    game.settings.register('introduce-me', 'introduction-duration', {
        name: game.i18n.localize('introduceMe.gameSettings.introductionDuration.name'),
        hint: game.i18n.localize('introduceMe.gameSettings.introductionDuration.hint'),
        scope: 'world',
        default: 2,
        config: true,
        type: Number,
    });

    game.settings.register('introduce-me', 'introduction-colors', {
        name: game.i18n.localize('introduceMe.gameSettings.introductionColors.name'),
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