import Scalable from "./Scalable.js";
import { cleanupDOM } from './Introduction.js';

export default class BannerSettings extends FormApplication {
    constructor(token, actor) {
        const position = game.settings.get('introduce-me', 'position');
        super({}, {
            title: game.i18n.localize('introduceMe.bannerSettings.label'),
            width: position.width,
            top: position.top,
            left: position.left,
            scale: position.scale,
        });
        const introductionColors = game.settings.get('introduce-me', 'introduction-colors');
        const introductionColorsArray = Object.keys(introductionColors).reduce((acc, key) => {
            acc.push({
                ...introductionColors[key],
                id: key,
                label: key,
            }); 
            return acc
        }, []);
        const templates = game.settings.get('introduce-me', 'color-templates');
        this.colors = introductionColorsArray.concat(templates);
        this.color = {
            ...introductionColors.friendly,
            id: 'friendly',
            label: 'friendly',
        };

        this.token = token;
        this.actor = actor;
    }

    static get defaultOptions() {
      const defaults = super.defaultOptions;
      const overrides = {
        id: 'banner-settings',
        template: 'modules/introduce-me/templates/introductionInner.hbs',
        closeOnSubmit: false,
        submitOnChange: true,
        resizable: true,
        classes: ["introduce-me", "banner-settings"],
      };
      
      const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
      
      return mergedOptions;
    }

    getData() {
        return { 
            colors: this.color,
            editing: true,
            img: 'icons/svg/cowled.svg',
            name: game.i18n.localize("introduceMe.colorSettings.tester"),
            flavor: game.i18n.localize("introduceMe.introduceDialog.flavorTitle"), // Flavor parse?
            showSettings: 2,
        };
    }

    async _updateObject(event, formData){
        this.color = this.colors.find(x => x.id === formData.color);
        this.render();
    }

    async _renderOuter() {
        const outer = $(await renderTemplate('modules/introduce-me/templates/bannerSettings.hbs'));
        outer[0].style.height= 'auto';
        const header = $(outer).find('.position-anchor')[0];
        new Scalable(this, outer, header, true);
        return outer;
    }

    render(force, options) {
        cleanupDOM();
        super.render(force, options);
    }

    activateListeners(html) {
        super.activateListeners(html);

        $(html).find('.close-button').click(event => {
            this.close();
        });

        $(html).find('.check-button').click(event => {
            game.settings.set('introduce-me', 'position', this.position);
            this.close();
        });

        $(html).find('.default-button').click(event => {
            this.setPosition(defaultPosition);
            this.render();
        });
    }
}

export const defaultPosition = {
    height: 125,
    left: window.innerWidth*0.5-358,
    scale: 1,
    top: 100,
    width: 716,
    zIndex: 0,
};