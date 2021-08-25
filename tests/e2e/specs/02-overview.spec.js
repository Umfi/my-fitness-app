// https://docs.cypress.io/api/introduction/api.html

describe('Overview Tests', () => {

  beforeEach(() => {
    cy.login('true');
  })

  it('Visits the app home screen', () => {
    cy.visit('/tabs/overview')
    cy.get(':nth-child(2) > ion-card-header.ion-inherit-color > .ion-inherit-color', { timeout: 60000 }).should('contain', 'Calories Overview')
  })

})
