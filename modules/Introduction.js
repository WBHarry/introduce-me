import gsap, { SplitText } from "/scripts/greensock/esm/all.js";
import FlavorDialog from './FlavorDialog.js';

export default class Introduction {
    static introduceMe = async (token) => {
        if(token) {
            await socket.emit(`module.introduce-me`, { uuid: token.document.uuid });
            await Introduction.introductionDisplay(token, token.document._actor);
        }
    }

    static introductionDisplay = async (token, actor, overrideFlavor) => {
        if(token){
            const flavor = overrideFlavor ?? actor.getFlag('introduce-me', 'flavor') ?? '"No veggies. I go Ham!"';
            $(document.body).append($(await renderTemplate('modules/introduce-me/templates/introduction.hbs', { token: token, img: actor.img, flavor: flavor })));
            token.data.update({displayName: 30});
            const node = $(document.body).find('.introduce-me.introduction');
            const container = $(node).find('.introduction-container');
            const image = $(container).find('img#actorImage');
            const label = $(container).find('label').first();
            const citation = $(container).find('label').last();
            const splitLabel = new SplitText(label, {type:"words,chars"});
            const splitCitation = new SplitText(citation, {type:"words,chars"});
    
            const animationTimeline = gsap.timeline();
                animationTimeline
                    .to(container, {width: 716, duration: 1})
                    .to(image, {opacity: 1, duration: 1})
                    .from(image, {left: -100, duration: 1}, "<+=0.2")
                    .to(label, {opacity: 1, duration: 0.2})
                    .from(splitLabel.chars, 0.8, {
                        opacity: 0, scale: 0, y: 80, rotationX: 180, transformOrigin: "0% 50% -50"
                    }, "<")
                    .to(citation, {opacity: 1, duration: 0.2})
                    .from(splitCitation.chars, 0.8, {
                        opacity: 0, scale: 0, y: 80, rotationX: 180, transformOrigin: "0% 50% -50"
                    }, "<")
                    .to(node, { opacity: 0, duration: 0.5 }, ">2");
            setTimeout(() => {
                $(node).remove();
            }, 6000);
        }
    };

    static setFlavor = async (token) => {
        if(token){
            await new FlavorDialog(token).render(true);
            // new Dialog({
            //     title: game.i18n.localize('introduceMe.flavorDialog.title'),
            //     content: await renderTemplate('modules/introduce-me/templates/flavorDialog.hbs', {
            //         flavor: token.document._actor.getFlag('introduce-me', 'flavor')
            //     }),
            //     buttons: {
            //         preview: {
            //             icon: '<i class="fas fa-eye"></i>',
            //             label: game.i18n.localize('introduceMe.flavorDialog.preview'),
            //             callback: async html => {
            //                 const flavor =  $(html).find('input')[0].value;
            //                 await Introduction.introduceMe(token, flavor);
            //             }
            //         },
            //         update: {
            //             icon: '<i class="fas fa-sync"></i>',
            //             label: game.i18n.localize('introduceMe.flavorDialog.update'),
            //             callback: html => {
            //                 const flavor =  $(html).find('input')[0].value;
            //                 token.document._actor.setFlag('introduce-me', 'flavor', flavor);
            //             }
            //         }
            //     },
            //     default: "update",
            // }).render(true);
        }
    }
}