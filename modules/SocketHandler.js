import Introduction from './Introduction.js';

export const setupSockets = async () => {
    game.socket.on(`module.introduce-me`, async request => {
        switch(request.type){
            case RequestType.introduce:
                const token = await fromUuid(request.data.uuid);
                await new Introduction().introductionDisplay(token, token.actor);
                break;
        }
    });
}

export const RequestType = {
    introduce: 'introduce',
    close: 'close',
    toggleAudio: 'toggleAudio',
};