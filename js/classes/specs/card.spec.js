'use strict';

define(['jquery', 'howler', '../card'], function ($, H, Card) {
  describe('Card', function() {
    let card;
    let cardParent;
    let cardValue;
    let faceUrl;
    let backUrl;

    beforeAll(function () {
      cardValue = rndString();
      faceUrl = rndString();
      backUrl = rndString();

      $('body').append('<div id="cardParent"></div>');
      cardParent = $('#cardParent');
    });

    beforeEach(function () {
      card = new Card(cardParent, cardValue, faceUrl, backUrl, false, false);
    });

    afterEach(function () {
      card.element.remove();
    });

    describe('on initialization', function () {
      it('should have correct properties', function () {
        expect(card.parent.get(0)).toBe(cardParent.get(0));
        expect(card.value).toEqual(cardValue);
        expect(card.faceUrl).toEqual(faceUrl);
        expect(card.backUrl).toEqual(backUrl);
        expect(card.element.data('card')).toBe(card);
      });

      it('should have correct html structure', function () {
        expect(card.element.parent().get(0)).toBe(cardParent.get(0));
        expect(card.element.find('div').length).toEqual(2);
        expect(card.element.find('*').length).toEqual(2);
        expect(card.element.prop('tagName')).toEqual('DIV');
      });

      it('should have properly defined html attributes', function () {
        expect(card.element.hasClass('card')).toBeTruthy();

        expect(card.element.find('.card-front').attr('style'))
          .toEqual(`background-image: url(${faceUrl})`);
        expect(card.element.find('.card-back').attr('style'))
          .toEqual(`background-image: url(${backUrl})`);

        let vals = [true, false];
        let testCard;

        vals.forEach(function (val1) {
          vals.forEach(function (val2) {
            testCard = new Card(cardParent, cardValue, faceUrl, backUrl, val1, val2);

            expect(testCard.interactive).toEqual(val1);
            expect(testCard.flipped).toEqual(val2);

            if (val1)
              expect(testCard.element.hasClass('interactive')).toBeTruthy();
            else
              expect(testCard.element.hasClass('interactive')).toBeFalsy();;

            if (val2)
              expect(testCard.element.hasClass('flipped')).toBeTruthy();
            else
              expect(testCard.element.hasClass('flipped')).toBeFalsy();;

            testCard.element.remove();
          });
        });
      });
    });

    describe('should be able to update data' , function() {
      it('in bulk', function () {
        let val = rndString();
        let face = rndString();
        let back = rndString();

        card.updateData(val, face, back, false, false);

        expect(card.value).toEqual(val);
        expect(card.faceUrl).toEqual(face);
        expect(card.backUrl).toEqual(back);
        expect(card.interactive).toBeFalsy();;
        expect(card.flipped).toBeFalsy();;

        expect(card.element.find('.card-front').attr('style'))
          .toEqual(`background-image: url(${face})`);
        expect(card.element.find('.card-back').attr('style'))
          .toEqual(`background-image: url(${back})`);

        let vals = [true, false];

        vals.forEach(function (val1) {
          vals.forEach(function (val2) {
            card.updateData(val, face, back, val1, val2);

            expect(card.interactive).toEqual(val1);
            expect(card.flipped).toEqual(val2);

            if (val1)
              expect(card.element.hasClass('interactive')).toBeTruthy();
            else
              expect(card.element.hasClass('interactive')).toBeFalsy();;

            if (val2)
              expect(card.element.hasClass('flipped')).toBeTruthy();
            else
              expect(card.element.hasClass('flipped')).toBeFalsy();;
          });
        });
      });

      it('backFace only', function () {
        let back = rndString();

        card.updateBack(back);

        expect(card.backUrl).toEqual(back);

        expect(card.element.find('.card-back').attr('style'))
          .toEqual(`background-image: url(${back})`);
      })
    });

    describe('should provide possibility of altering "interactive" property', function () {
      let testCards = [];
      let val = [true, false];

      beforeEach(function () {
        for (let i = 0; i < 2; i++)
          testCards.push(new Card(cardParent, cardValue, faceUrl, backUrl, val[i], false));
      });

      afterEach(function () {
        testCards.forEach(card => {
          card.element.remove();
        });
        testCards = [];
      });

      it('when allow interaction', function () {
        testCards.forEach(testCard => {
          testCard.allowInteraction();

          expect(testCard.interactive).toBeTruthy();
          expect(testCard.element.hasClass('interactive')).toBeTruthy();
        });
      });

      it('when disallow interaction', function () {
        testCards.forEach(testCard => {
          testCard.forbidInteraction();

          expect(testCard.interactive).toBeFalsy();
          expect(testCard.element.hasClass('interactive')).toBeFalsy();
        });
      });
    });

    describe('on flip', function () {
      it('should set corresponding class and properties', function () {
        let testCards = [];
        let val = [true, false];

        for (let i = 0; i < 2; i++)
          testCards.push(new Card(cardParent, cardValue, faceUrl, backUrl, false, val[i]));

        testCards.forEach(card => {
          card.flip();
        });

        testCards.forEach((card, i) => {
          expect(card.flipped).toEqual(!!i);
          expect(card.element.hasClass('flipped')).toEqual(!!i);
        });

        testCards.forEach(card => {
          card.element.remove();
        });
      });

      it('should set (if passed) callback for card element on "transitionend" and "webkitTransitionEnd" events ' +
        'for transform property which will be called only once (even if both of the events will come)', function () {

        let cb = jasmine.Spy('flipCallback');
        let trend = 'transitionend';
        let wtrend = 'webkitTransitionEnd';

        card.flip(cb);

        trigger(cb, trend, 'is-not-transform', 0);
        trigger(cb, wtrend, 'is-not-transform', 0);
        trigger(cb, 'is-not-trend', 'transform', 0);

        // cb on trend:

        trigger(cb, trend, 'transform', 1);

        trigger(cb, trend, 'transform', 1);
        trigger(cb, wtrend, 'transform', 1);

        trigger(cb, trend, 'is-not-transform', 1);
        trigger(cb, wtrend, 'is-not-transform', 1);
        trigger(cb, 'is-not-trend', 'transform', 1);

        card.flip(cb);

        // cb on wtrend:

        trigger(cb, wtrend, 'transform', 2);

        trigger(cb, trend, 'transform', 2);
        trigger(cb, wtrend, 'transform', 2);

        trigger(cb, trend, 'is-not-transform', 2);
        trigger(cb, wtrend, 'is-not-transform', 2);
        trigger(cb, 'is-not-trend', 'transform', 2);
      });

      it('should provide possibility of revoking callback', function () {
        let cb = jasmine.Spy('flipCallback');

        card.flip(cb);
        card.revokeFlipCallback();

        trigger(cb, 'transitionend', 'transform', 0);

        card.flip(cb);
        card.revokeFlipCallback();

        trigger(cb, 'webkitTransitionEnd', 'transform', 0);
      });

      function trigger(cb, event, prop, expectedCount) {
        let e = new Event(event);

        e.propertyName = prop;
        card.element.get(0).dispatchEvent(e);

        expect(cb.calls.count()).toEqual(expectedCount);
      }
    });

    describe('static methods', function () {
      it('should expose correct flip time', function() {
        let ms = Card.flipTime;

        expect(Number.isInteger(ms) && ms >= 0).toBeTruthy();
      });

      it('should expose flip sound from class property', function() {
        let sound = Card.flipSoundSprite;

        expect(sound).toEqual(Card.flipSound);
      });
    });

    afterAll(function () {
      cardParent.remove();
    });
  });
});

function rndString() {
  return Math.random().toString(36).substring(7);
}