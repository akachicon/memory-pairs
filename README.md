# Memory game

## Description
Memory pairs is a client-side card game where a player needs to match pairs of cards. The rules is very simple - the player has five seconds to remember the cards, after which all cards turn over. Next, the player turns over one card and then try to find a matching card. If he succeeded, he gets score points and the cards remain in exposed state, if not, the cards flip backward and a certain amount of score points goes away. When all cards are in exposed state the game is ended.

The game might be tried [here](https://memory-pairs.herokuapp.com/).

## Technical details
The poject is a node http-server, all the game logic runs on the client. The game field and other game elements scales according to the viewport size (but there is always three rows and six columns). The text does not scale. All animations were created via CSS.

## Prerequisites
 - npm and [Node.js](https://nodejs.org/)
 - browser (the game was primarily developed for Chrome and Firefox)

## Installing
Get to the project directory in a console and install the dependencies, after which start server.
```sh
$ cd memory-game
$ npm i
$ npm start
```
After starting the server go to "localhost:3030" in your browser.
To start the server NOT on the default (3030) port you should declare env variable PORT.
 - Windows:
```sh
$ set PORT=5050
```

 - Linux:
```sh
$ PORT=5050
```

## Running the test
To run test you should get to the project directory in a console and run "npm test".
```sh
$ cd memory-game
$ npm test
```
The tests run Chrome browser for execution, after which browser shuts down. You might see the results in the console. Only one game class (Card) out of two (Card, Game) has been tested with Jasmine.

## Software used
### Server
 - node.js + express framework

### Client-side
 - require.js   (AMD)
 - jquery.js    (DOM)
 - howler.js	(sounds)

### Tests
 - karma		(test environment)
 - karma-chrome-launcher
 - karma-firefox-launcher
 - karma-coverage
 - karma-requirejs
 - karma-jasmine
 - jasmine-core
 - requirejs
