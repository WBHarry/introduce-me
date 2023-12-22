import ColorSettings, { DefaultColors } from './ColorSettings.js';
import ColorTemplates from './ColorTemplates.js';
import BannerSettings, { defaultPosition } from './BannerSettings.js';

export const registerGameSettings = () => {
    game.settings.registerMenu("introduce-me", "color-settings", {
        name: game.i18n.localize('introduceMe.colorSettings.name'),
        label: game.i18n.localize('introduceMe.colorSettings.label'),
        hint: "",
        icon: "fas fa-palette",
        type: ColorSettings,
        restricted: true
    });

    game.settings.registerMenu("introduce-me", "color-templates", {
        name: game.i18n.localize('introduceMe.colorTemplates.name'),
        label: game.i18n.localize('introduceMe.colorTemplates.label'),
        hint: "",
        icon: "fas fa-book",
        type: ColorTemplates,
        restricted: true
    });

    game.settings.registerMenu("introduce-me", "banner-settings", {
        name: game.i18n.localize('introduceMe.bannerSettings.name'),
        label: game.i18n.localize('introduceMe.bannerSettings.label'),
        hint: "",
        icon: "far fa-image",
        type: BannerSettings,
        restricted: false
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

    game.settings.register('introduce-me', 'use-actor-name', {
        name: game.i18n.localize('introduceMe.gameSettings.useActorName.name'),
        hint: game.i18n.localize('introduceMe.gameSettings.useActorName.hint'),
        scope: 'world',
        default: false,
        config: true,
        type: Boolean,
    });

    game.settings.register('introduce-me', 'set-display-name', {
        name: game.i18n.localize('introduceMe.gameSettings.setDisplayName.name'),
        hint: game.i18n.localize('introduceMe.gameSettings.setDisplayName.hint'),
        scope: 'world',
        default: false,
        config: true,
        type: Boolean,
    });

    game.settings.register('introduce-me', 'use-introduce-permission', {
        name: game.i18n.localize('introduceMe.gameSettings.useIntroducePermission.name'),
        hint: game.i18n.localize('introduceMe.gameSettings.useIntroducePermission.hint'),
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

    game.settings.register('introduce-me', 'color-templates', {
        name: '',
        hint: '',
        scope: 'world',
        default: [],
        config: false,
        type: Object,
    });

    game.settings.register('introduce-me', 'position', {
        name: '',
        hint: '',
        scope: 'client',
        default: defaultPosition,
        config: false,
        type: Object,
    });
};

export const registerHandlebars = () => {
    loadTemplates([
        'modules/introduce-me/templates/introduction.hbs',
        'modules/introduce-me/templates/partials/colorSetting.hbs',
        'modules/introduce-me/templates/partials/colorTemplate.hbs',
        'modules/introduce-me/templates/partials/colorSettingHeader.hbs',
    ]);
}