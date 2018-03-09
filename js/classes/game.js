'use strict';

define(['jquery', 'howler', './card'], function ($, H, Card) {
  class Game {
    constructor(cardField, scoreFields, dttm) {
      this.cardField = cardField;
      this.scoreFields = scoreFields;
      this.defaultTimeToMemorize = dttm || 5000;
      this.buffer = null;
      this.rows = 3;
      this.columns = 6;
      this.inGameCards = [];
      this.scoreMultiplier = 42;
      this.timers = [];
      this.intervals = [];
      this.startDelay = 100;
      this.afterFlipTime = 300;

      this.bgMusic = new H.Howl({
        src: ['resources/sounds/bg-music.mp3'],
        html5: true,
        autoplay: true,
        loop : true
      });

      let cardParent = cardField.find('.card-field-row');

      for (let i = 0; i < this.rows * this.columns; i++) {
        let card = new Card(
          cardParent.eq(Math.floor(i / this.columns)), null, null, 'resources/cards/back.png', false, true);

        this.inGameCards.push(card);
      }

      cardField.on('click', e => {
        let target = $(e.target.parentNode);

        if (!target.hasClass('card') || !target.data('card').interactive)
          return;

        let card = target.data('card');
        let buffer = this.buffer;
        let callback;

        card.forbidInteraction();

        if (!this.buffer) {
          this.buffer = card;

          callback = () => {
            card.element.addClass('lightened');
          }
        } else if (buffer.value !== card.value) {
          this.buffer = null;
          this.score -= this.scoreMultiplier * (this.rows * this.columns / 2 - this.pairsToSolve + 1);

          let score = this.score;

          callback = () => {
            buffer.element.removeClass('lightened');

            this.setTimeout(() => {
              buffer.flip(() => {
                buffer.allowInteraction();
              });
              card.flip(() => {
                card.allowInteraction();
              });
            }, this.afterFlipTime);

            this.updateScore(score);
          };
        } else {
          this.buffer = null;
          this.score += this.scoreMultiplier * this.pairsToSolve--;

          let score = this.score;

          callback = () => {
            buffer.element.addClass('equal');
            card.element.addClass('equal');

            this.setTimeout(() => {
              buffer.element.removeClass('equal lightened');
              card.element.removeClass('equal lightened');

              buffer.element.addClass('inactive');
              card.element.addClass('inactive');

              if (this.pairsToSolve === 0) {
                this.inGameCards.forEach((card, idx) => {
                  card.updateBack('resources/cards/win' + idx + '.png');
                });

                this.setTimeout(() => {
                  this.end();
                }, 2 * this.afterFlipTime);
              }
            }, this.afterFlipTime);

            this.updateScore(score);
          };
        }

        card.flip(callback);
      });
    }

    start(ttm) {
      this.score = 0;
      this.buffer = 0;
      this.pairsToSolve = this.columns * this.rows / 2;

      this.clearAllTimeouts();
      this.clearAllIntervals();
      this.updateScore(0);

      let startDelay = this.startDelay;
      let timeToMemorize = ttm || this.defaultTimeToMemorize;
      let randomCards = Game.getRandomCards(this.rows * this.columns / 2);

      randomCards = randomCards.concat(randomCards);
      randomCards = Game.shuffleCards(randomCards);

      this.inGameCards.forEach((card) => {
        if (!card.flipped) {
          card.flip();
          startDelay = this.startDelay + Card.flipTime;
        }

        card.element.removeClass('lightened equal');
        card.revokeFlipCallback();
      });

      this.setTimeout(() => {
        this.inGameCards.forEach((card, idx) => {
          card.updateData(
            randomCards[idx],
            'resources/cards/' + randomCards[idx] + '.png',
            'resources/cards/back.png',
            false,
            true
          );

          card.element.removeClass('inactive');
        });

        this.flipAll();

        this.setTimeout(() => {
          this.flipAll(() => {
            this.inGameCards.forEach(card => {
              card.allowInteraction();
            });
          });
        }, timeToMemorize);
      }, startDelay);
    }

    end() {
      this.inGameCards.forEach(card => {
        card.flip();
      });

      this.setTimeout(() => {
        this.cardField.trigger('game.end');
      }, 2 * Card.flipTime);

      this.setTimeout(() => {
        this.inGameCards.forEach(card => {
          card.updateBack('resources/cards/back.png');
        })
      }, 2 * Card.flipTime + 100);
    }

    updateScore(score) {
      this.scoreFields.text(score);
    }

    flipAll(callback, time) {
      let step = 6;
      let ms = time || 200;
      let columns = this.columns;

      let flipInterval = this.setInterval(() => {
        if (step < columns * 2)
          this.inGameCards[step].flip();

        if (step > columns) {
          this.inGameCards[step + columns - 1].flip();
          this.inGameCards[step - columns - 1].flip(step > 2 * columns - 1 && callback);
        }

        if (step > 11) {
          this.clearInterval(flipInterval);
        }

        step++;
      }, ms);
    }

    setTimeout(callback, time) {
      let timerId;

      timerId = setTimeout(() => {
        callback();
        removeTimer(this.timers, timerId);
      }, time);

      this.timers.push(timerId);

      function removeTimer(timers, id) {
        let timerIdx;

        timerIdx = timers.indexOf(id);
        timers.splice(timerIdx, 1);
      }

      return timerId;
    }

    clearTimeout(id) {
      let timerIdx = this.timers.indexOf(id);

      if (timerIdx !== -1) {
        this.timers.splice(timerIdx, 1);
        clearTimeout(id);
      }
    }

    clearAllTimeouts() {
      this.timers.forEach(id => {
        clearTimeout(id);
      });

      this.timers = [];
    }

    setInterval(callback, time) {
      let intervalId;

      intervalId = setInterval(() => {
        callback();
      }, time);

      this.intervals.push(intervalId);

      return intervalId;
    }

    clearInterval(id) {
      let intervalIdx = this.intervals.indexOf(id);

      if (intervalIdx !== -1) {
        this.intervals.splice(intervalIdx, 1);
        clearInterval(id);
      }
    }

    clearAllIntervals() {
      this.intervals.forEach(id => {
        clearInterval(id);
      });

      this.intervals = [];
    }

    static getRandomCards(amount) {
      let deck = Game.shuffleCards(Game.deck);

      return deck.slice(0, amount);
    }

    static shuffleCards(cards) {
      for (let i = cards.length - 1; i > 1; i--)
      {
        let r = Math.floor(Math.random() * i);
        let t = cards[i];

        cards[i] = cards[r];
        cards[r] = t;
      }

      return cards;
    }

    static get deck() {
      let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 0, 'J', 'Q', 'K', 'A'];
      let deck = [];

      ranks.forEach((rank) => {
        deck.push(rank + 'C');
        deck.push(rank + 'H');
        deck.push(rank + 'D');
        deck.push(rank + 'S');
      });

      return deck;
    }

    static loadDeck(evtTarget) {
      let deck = Game.deck.concat('back');

      for (let i = 0; i < 18; i++)
        deck.push('win' + i);

      deck.forEach(card => {
        $.get({
          url: 'resources/cards/' + card + '.png',
          complete: () => {
            evtTarget.trigger('game.chunk:loaded', [deck.length]);
          }
        });
      });
    }
  }

  return Game;
});