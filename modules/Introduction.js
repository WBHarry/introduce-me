import gsap, { SplitText } from "/scripts/greensock/esm/all.js";

export default class Introduction {
    static introduceMe = async (token) => {
        const flavor = token.document.getFlag('introduce-me', 'flavor') ?? '';
        $(document.body).append($(await renderTemplate('modules/introduce-me/templates/introduction.hbs', { token: token, flavor: flavor })));
        token.data.update({displayName: 30});
        const node = $(document.body).find('.introduce-me');
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
        //         .to(node, { opacity: 0, duration: 0.5 }, ">2");
        // setTimeout(() => {
        //     $(node).remove();
        // }, 6000);
    };
}