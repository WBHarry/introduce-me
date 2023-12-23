import API from "./API/api.js";
import CONSTANTS from "./constants/constants.js";
import { debug } from "./lib/lib.js";

export let introduceMeSocket;

export function registerSocket() {
  debug("Registered introduceMeSocket");
  if (introduceMeSocket) {
    return introduceMeSocket;
  }

  introduceMeSocket = socketlib.registerModule(CONSTANTS.MODULE_ID);

  introduceMeSocket.register("introduceMe", (...args) => API.introduceMeArr(...args));

  game.modules.get(CONSTANTS.MODULE_ID).socket = introduceMeSocket;
  return introduceMeSocket;
}
