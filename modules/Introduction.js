import gsap, { SplitText } from "/scripts/greensock/esm/all.js";
import IntroduceDialog from './IntroduceDialog.js';
import { getActorIntroductionColors } from './ColorSettings.js';

export default class Introduction {
    constructor() {
      if (!Introduction._instance) {
        Introduction._instance = this;
      }

      return Introduction._instance;
    }

    introduceMe = async (token) => {
        if(game.user.isGM && token) {
            await game.socket.emit(`module.introduce-me`, { uuid: token.document.uuid });
            await this.introductionDisplay(token, token.actor);
        }
    }

    introductionDisplay = async (token, actor, preview, overrideFlavor, overrideDuration) => {
        if(token){
            if(!preview && game.user.isGM){
                await actor.update({'token.displayName': 30});
                const scenes = Array.from(game.scenes);
                for(let i = 0; i < scenes.length; i++){
                    const tokens = Array.from(scenes[i].tokens);
                    for(let j = 0; j < tokens.length; j++){
                        const token = tokens[j];
                        if(token.data.actorId === actor.id){
                            await token.update({displayName: 30});
                        }
                    }
                }   
            }

            const defaultIntroductionDuration = game.settings.get('introduce-me', 'introduction-duration');
            const actorIntroductionDuration = actor.getFlag('introduce-me', 'introduction-duration');
            const introductionDuration = overrideDuration ? overrideDuration : actorIntroductionDuration !== undefined ? actorIntroductionDuration : defaultIntroductionDuration;

            $(document.body).find('.introduce-me.introduction').remove();
            const flavor = overrideFlavor ?? actor.getFlag('introduce-me', 'flavor') ?? '';
            const colors = getActorIntroductionColors(token, actor);
            $(document.body).append($(await renderTemplate('modules/introduce-me/templates/introduction.hbs', { 
                token: token, 
                img: this.getIntroductionImage(token, actor), 
                flavor: flavor,
                colors: colors,
            })));
            const node = $(document.body).find('.introduce-me.introduction');
            const container = $(node).find('.introduction-container');
            const image = $(container).find('img#actorImage');
            const label = $(container).find('label#name');
            const citation = $(container).find('label#citation');
            const splitLabel = new SplitText(label, {type:"words,chars"});
            const splitCitation = new SplitText(citation, {type:"words,chars"});
            
            const animationTimeline = gsap.timeline();
            animationTimeline
                .to(container, {width: 716, duration: 1})
                .to(image, {opacity: 1, duration: 1})
                .from(image, {left: -100, duration: 1}, "<+=0.2");

            if(splitLabel.chars.length > 0){
                animationTimeline
                    .to(label, {opacity: 1, duration: 0.2})
                    .from(splitLabel.chars, 0.8, {
                        opacity: 0, scale: 0, y: 80, rotationX: 180, transformOrigin: "0% 50% -50"
                    }, "<");
            }

            if(splitCitation.chars.length > 0){
                animationTimeline
                    .to(citation, {opacity: 1, duration: 0.2})
                    .from(splitCitation.chars, 0.8, {
                        opacity: 0, scale: 0, y: 80, rotationX: 180, transformOrigin: "0% 50% -50"
                    }, "<");
            }             

            animationTimeline.to(node, { opacity: 0, duration: 0.5 }, `>${introductionDuration}`);
            setTimeout(() => {
                $(node).remove();
            }, 4000+(introductionDuration*1000));
        }
    }

    editDisplay = async (colors, localToken, localActor) => {
        $(document.body).find('.introduce-me.introduction').remove();
        const flavor = localActor?.getFlag('introduce-me', 'flavor') ?? game.i18n.localize("introduceMe.introduceDialog.flavorTitle");

        $(document.body).append($(await renderTemplate('modules/introduce-me/templates/introduction.hbs', { 
            token: localToken ?? {
                name: game.i18n.localize("introduceMe.colorSettings.tester")
            }, 
            img: localActor ? this.getIntroductionImage(localToken, localActor) : 'icons/svg/cowled.svg', 
            flavor: flavor,
            colors: colors,
            editing: true,
        })));

        $(document.body).find('.introduce-me.introduction > .introduction-container > .close-button').click(event => {
            $(document.body).find('.introduce-me.introduction').remove();
        });
    };

    introduceMeDialog = async (token) => {
        if(game.user.isGM && token){
            await new IntroduceDialog(token).render(true);
        }
    }

    renderHUD = async (data, html) => {
        const rightColumn = $(html).find('.col.right');
        $(rightColumn).append(await renderTemplate('modules/introduce-me/templates/introductionInteract.hbs'));

        const introduceButton = $(rightColumn).find('.introduce-me.introduction-interact');
        introduceButton.click(async () => {
            await this.introduceMeDialog(data.object);
            data.clear();
        });
    }

    getIntroductionImage = (token, actor) => {
        const useToken = game.settings.get('introduce-me', 'use-token');
        return useToken ? token.data.img : actor.img;
    }
}