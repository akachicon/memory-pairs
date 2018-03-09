'use strict';

requirejs.config({
  baseUrl: 'js/',
  paths: {
    jquery: 'lib/jquery.min',
    howler: 'lib/howler.min'
  }
});

requirejs(['jquery', 'classes/card', 'classes/game'], function ($, Card, Game) {
  let loadBar = $('.load-bar');
  let chunksLoaded = 0;

  loadBar.on('game.chunk:loaded', (e, chunksInTotal) => {
    chunksLoaded++;
    loadBar.width(chunksLoaded / chunksInTotal * 96 + '%');

    if (chunksLoaded === chunksInTotal)
      $('.loading-screen-bg').fadeOut(150);
  });

  Game.loadDeck(loadBar);

  let startScreen = $('.start-screen');
  let actionScreen = $('.action-screen');
  let endScreen = $('.end-screen');
  let cardField = $('.card-field');

  let memoryPairs = new Game(cardField, $('.score-field'), 5000);

  startScreen.find('button').on('click', () => {
    startScreen.addClass('hidden');
    actionScreen.removeClass('hidden');

    memoryPairs.start();
  });

  endScreen.find('button').on('click', () => {
    endScreen.addClass('hidden');
    actionScreen.removeClass('hidden');

    memoryPairs.start();
  });

  actionScreen.find('button').on('click', () => {
    memoryPairs.start();
  });

  cardField.on('game.end', () => {
    actionScreen.addClass('hidden');
    endScreen.removeClass('hidden');
  });
});

