'use strict';

define(['jquery', 'howler'], function ($, H) {
  class Card {
    constructor(parent, value, faceUrl, backUrl, interactive, flipped) {
      this.parent = parent;
      this.value = value;
      this.faceUrl = faceUrl;
      this.backUrl = backUrl;
      this.interactive = !!interactive;
      this.flipped = !!flipped;

      $(`<div class="card${(interactive ? ' interactive' : '') + (flipped ? ' flipped' : '')}" data-tid="Card">
            <div class="card-front" style="background-image: url(${faceUrl})"></div>
            <div class="card-back" style="background-image: url(${backUrl})"></div>
         </div>`).appendTo(parent);

      this.element = parent.children(':last-child');
      this.element.data('card', this);
    }

    allowInteraction() {
      this.interactive = true;
      this.element.addClass('interactive');
    }

    forbidInteraction() {
      this.interactive = false;
      this.element.removeClass('interactive');
    }

    flip(callback) {
      this.element.toggleClass('flipped');
      this.flipped = !this.flipped;

      let cardElement = this.element;
      let cb = !!callback;

      cb && attachCallback();

      let flipSound = Card.flipSoundSprite;
      let playingSound = this.playingSound;

      if (playingSound)
        flipSound.stop(playingSound);

      this.playingSound = flipSound.play('regular');

      function attachCallback() {
        cardElement.one('transitionend webkitTransitionEnd', e => {
          if (!cb)
            return;

          if (e.originalEvent.propertyName === 'transform') {
            callback();
            cb = false;
          }
          else
            attachCallback();
        });
      }
    }

    revokeFlipCallback() {
      this.element.off('transitionend webkitTransitionEnd');
    }

    updateData(value, faceUrl, backUrl, interactive, flipped) {
      this.value = value;
      this.faceUrl = faceUrl;
      this.flipped = !!flipped;

      this.updateBack(backUrl);

      this.element.find('.card-front')
        .attr('style', `background-image: url(${faceUrl})`);

      interactive ? this.allowInteraction() : this.forbidInteraction();

      this.element.removeClass('flipped');
      flipped && this.element.addClass('flipped');
    }

    updateBack(backUrl) {
      this.backUrl = backUrl;
      this.element.find('.card-back')
        .attr('style', `background-image: url(${backUrl})`);
    }

    static get flipTime() {
      return 600;
    }

    static get flipSoundSprite() {
      return Card.flipSound;
    }
  }

  Card.flipSound = new H.Howl({
    src: ['resources/sounds/flip-sound.mp3'],
    sprite: {
      regular: [300, 800]
    },
    volume: 0.5
  });

  return Card;
});