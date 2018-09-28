const childPanel = '[data-cy=childpanel]';

describe('Child panel', () => {
  describe('layout interactions', () => {
    beforeEach(() => {
      cy.request('/reset');
      cy.visit('/gui/PANDA/layout');
      cy.waitForDetailsToLoad();

      cy.get(childPanel).should('not.be.visible');
    });

    it('should open when a block is clicked in the layout', () => {
      // click on the block to open the child panel
      cy.contains('TTL output 1').click('left');
      cy.get(childPanel).should('be.visible');

      // check that a property of TTL output 1 is visible in the details panel
      cy.contains('Val Current').should('be.visible');
    });

    it('should update child panel if already open', () => {
      // first make sure the child panel is open
      cy.contains('TTL output 1').click('left');
      cy.get(childPanel).should('be.visible');

      // click on another block and make sure the details update
      cy.contains('Input encoder 1').click('left');
      cy.get(childPanel).should('be.visible');
      cy.contains('Clk Period').should('be.visible');
    });

    it('should not open the child panel if a block was dragged', () => {
      cy.moveBlock('TTL output 1', { x: 450, y: 280 });
      cy.get(childPanel).should('not.be.visible');
    });

    it('should close the palette when a block is dropped on to the layout', () => {
      cy.contains('TTL output 1').should('be.visible');

      cy.get('[data-cy=palettebutton]').click('left');
      cy.get(childPanel).should('be.visible');
      cy
        .get(childPanel)
        .parent()
        .scrollTo('bottom');

      // simulate dropping a chip on to the layout
      cy.get('#LayoutDiv').trigger('drop', {
        dataTransfer: {
          getData: () => 'PANDA:PCOMP4',
        },
        clientX: 450,
        clientY: 180,
      });

      cy.get(childPanel).should('not.be.visible');
    });

    it('should open the child panel when a link is clicked on', () => {
      cy.contains('Auto layout').click();
      cy.wait(3000, { log: false });
      cy
        .get('#LayoutDiv')
        .find('path')
        .first()
        .click({ force: true });

      cy.get(childPanel).should('be.visible');
      cy.contains('Sink').should('be.visible');
    });

    it('should close the child panel when the layout background is clicked', () => {
      cy.visit('/gui/PANDA/layout/TTLOUT1');
      cy.waitForDetailsToLoad();
      cy.get(childPanel).should('be.visible');
      cy.contains('Val Current').should('be.visible'); // wait for details to load

      // click in an empty part of the layout
      cy.get('#LayoutDiv').click(450, 180);
      cy.get(childPanel).should('not.be.visible');
    });

    it('multi-selecting blocks closes child panel', () => {
      cy.contains('Auto layout').click();
      cy.wait(3000, { log: false });

      cy.contains('ADDER1').click('left');
      cy.get(childPanel).should('be.visible');
      cy
        .get('body')
        .type('{shift}', { release: false })
        .contains('BITS')
        .click();
      cy.get(childPanel).should('not.be.visible');
    });
  });

  describe('info button interactions', () => {
    it('should open when an info icon is pressed', () => {
      cy.request('/reset');
      cy.visit('/gui/PANDA');

      // click on the info icon
      cy
        .contains('Health')
        .parent()
        .find('button')
        .click();
      cy.get(childPanel).should('be.visible');

      // confirm info element is present
      cy.contains('Type ID').should('be.visible');
    });
  });
});
