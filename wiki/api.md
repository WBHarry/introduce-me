The api is reachable from the variable `game.modules.get('introduce-me').api` or from the socket libary `socketLib` on the variable `game.modules.get('introduce-me').socket` if present and active.

### The documentation can be out of sync with the API code checkout the code if you want to dig up [API](../src/scripts/api.js)

You can find some javascript examples here **=> [macros](./macros/) <=**

#### showChoices({options}):void ⇒ <code>Promise&lt;void&gt;</code>

**Returns**: <code>Promise&lt;void&gt;</code> - Return nothing

| Param | Type | Description | Note |
| --- | --- | --- | --- |
| options | `object` | | The options to pass to the function 
| [options.title] | <code>string</code> | The big title for the choice | |
| [options.text] | <code>string</code> | The little (and short), summary text for the choice | NOTE: You can use html core and document link on this text |
| [options.multi] | <code>boolean</code> | OPTIONAL: true or false, determines if multiple choices can be selected (default false) | |
| [options.time] | <code>number</code> | OPTIONAL: The number of seconds for make a decision (default 0) | |
| [options.img] | <code>string</code> | OPTIONAL: the path to the image to be displayed as the background (default null) | |
| [options.show] | <code>boolean</code> | OPTIONAL: true or false, determines if show the active choice | Working in progress for a better behavior |
| [options.player] | <code>string or string[]</code> | OPTIONAL: a comma separated list on a string or just a array of strings of player names, if not provided all players will get to chose | NOTE: You can use user name, or id or uuid associated to a user |
| [options.democracy] | <code>boolean</code> | OPTIONAL: true or false, determine if the choice with the highest votes will be picked (if true) or resolve the choice per player (if false) (default true) | |
| [options.default] | <code>number</code> | OPTIONAL: the default choice if no choice is made (default 0 the first choice on the list) | Working in progress for a better behavior |
| [options.displayResult] | <code>boolean</code> | OPTIONAL: true or false, determine if the result will be output to chat after the choice is made (default true) | |
| [options.resolveGM] | <code>boolean</code> | OPTIONAL: true or false, determine if the resolution of the choice should run on the gm side as well (default false) | |
| [options.portraits] | <code>string or string[]</code> | OPTIONAL: a comma separated list on a string or just a array of strings of actor names, if not provided no portrait is show | NOTE: You can use actor name, or id or uuid associated to a actor |
| [options.textColor] | <code>string</code> | OPTIONAL: apply a text color as css on the choice (default #000000eb) | |
| [options.backgroundColor] | <code>string</code> | OPTIONAL: apply a background color as css on the choice (default #000000ff) | |
| [options.buttonColor] | <code>string</code> | OPTIONAL: apply a button color as css on the choice (default #ffffffd8) | |
| [options.buttonHoverColor] | <code>string</code> | OPTIONAL: apply a button color as css when hover on the choice (default  #c8c8c8d8)| |
| [options.buttonActiveColor] | <code>string</code> | OPTIONAL: apply a button color as css when set active on the choice (default #838383d8) | |
| [options.alwaysOnTop] | <code>boolean</code> | OPTIONAL: true or false, determine if the choice will be on top of all other UI elements, i set with a valid boolean value it will override the module setting 'Always on top' | |
| [options.choices] | <code>ChoiceChild[]</code> | A array of choice child, every child is a button on the choice dialog | |

**Example basic**:

```javascript

game.modules.get('introduce-me').api.showChoices(
{
    title: "Title of the choice",
    text: "Summary text of the Choice",
    choices: [
        {
            text: "Go to the scene 1"
            scene: "Scene.duidg9et345"
        },
        {
            text: "Go to the scene 2"
            scene: "Scene.duidg9et355"
        },
        {
            text: "Go to the scene 3"
            scene: "Scene.duidg9et365"
        }
    ]
});

```