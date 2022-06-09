import gsap, { SplitText } from "/scripts/greensock/esm/all.js";
import IntroduceDialog from './IntroduceDialog.js';

export default class Introduction {
    constructor() {
      if (!Introduction._instance) {
        Introduction._instance = this;
      }

      return Introduction._instance;
    }

    introduceMe = async (token) => {
        if(game.user.isGM && token) {
            await socket.emit(`module.introduce-me`, { uuid: token.document.uuid });
            await this.introductionDisplay(token, token.actor);
        }
    }

    introductionDisplay = async (token, actor, preview, overrideFlavor) => {
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

            $(document.body).find('.introduce-me.introduction').remove();
            const flavor = overrideFlavor ?? actor.getFlag('introduce-me', 'flavor') ?? '';
            $(document.body).append($(await renderTemplate('modules/introduce-me/templates/introduction.hbs', { token: token, img: actor.img, flavor: flavor })));
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

            animationTimeline.to(node, { opacity: 0, duration: 0.5 }, ">2");
            setTimeout(() => {
                $(node).remove();
            }, 6000);
        }
    }

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
}