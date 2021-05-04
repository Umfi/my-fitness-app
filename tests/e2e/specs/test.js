// https://docs.cypress.io/api/introduction/api.html

describe('Login/Register Tests', () => {

  before(() => {
    cy.request('DELETE', Cypress.env('API_BASE_URL') + 'test/deleteTestAccount', {
      email: Cypress.env('TEST_USER_EMAIL'),
      password: Cypress.env('TEST_USER_PW')
    })
  })

  it('Visits the app login page', () => {
    cy.visit('/')
    cy.get('#loginBtn').should('contain', 'Login')
  })

  it('Enter no data and submit form', () => {
    cy.visit('/login')
    cy.get('#loginBtn').click()
    cy.get('#emailValidationText').should('contain', 'E-Mail is required')
    cy.get('#passwordValidationText').should('contain', 'Password is required')
  })

  it('Enter invalid email and submit form', () => {
    cy.visit('/login')
    cy.get('#email').type('invalidmail')
    cy.get('#loginBtn').click()
    cy.get('#emailValidationText').should('contain', 'Please enter a valid E-Mail')

    cy.get('input[name="email"]').clear().type('    ')
    cy.get('#loginBtn').click()
    cy.get('#emailValidationText').should('contain', 'E-Mail is required')
  })

  it('Enter valid email but no password and submit form', () => {
    cy.visit('/login')
    cy.get('#email').type('valid@mail.com')
    cy.get('#loginBtn').click()
    cy.get('#emailValidationText').should('not.be.visible')
    cy.get('#passwordValidationText').should('contain', 'Password is required')
  })

  it('Enter valid email and password should hide all error text', () => {
    cy.visit('/login')
    cy.get('#email').type('valid@mail.com')
    cy.get('#password').type('password')
    cy.get('#emailValidationText').should('not.be.visible')
    cy.get('#passwordValidationText').should('not.be.visible')
  })

  it('Navigate to forgot password page', () => {
    cy.visit('/login')
    cy.contains('Forgot password?').click()
    cy.get('ion-card-header').should('contain', 'Reset password')
  })

  it('Navigate to register page', () => {
    cy.visit('/login')
    cy.contains('Sign up now!').click()
    cy.get('ion-card-header').should('contain', 'Register')
  })

  it('Register an account with no data', () => {
    cy.visit('/register')
    cy.get('#registerBtn').click()
    cy.get('#nameValidationText').should('contain', 'Name is required')
    cy.get('#emailValidationText').should('contain', 'E-Mail is required')
    cy.get('#passwordValidationText').should('contain', 'Password is required')
  })

  it('Register an account with invalid data', () => {
    cy.visit('/register')
    cy.get('input[name="name"]').type('JohnDoe!234')
    cy.get('#registerBtn').click()
    cy.get('#nameValidationText').should('contain', 'Please enter a valid name (Only letters A-Z)')

    cy.get('input[name="name"]').clear().type('JohnDoe!')
    cy.get('#registerBtn').click()
    cy.get('#nameValidationText').should('contain', 'Please enter a valid name (Only letters A-Z)')

    cy.get('input[name="name"]').clear().type('John_Doe')
    cy.get('#registerBtn').click()
    cy.get('#nameValidationText').should('contain', 'Please enter a valid name (Only letters A-Z)')

    cy.get('input[name="name"]').clear().type(' ')
    cy.get('#registerBtn').click()
    cy.get('#nameValidationText').should('contain', 'Name is required')

    cy.get('input[name="name"]').clear().type('   ')
    cy.get('#registerBtn').click()
    cy.get('#nameValidationText').should('contain', 'Name is required')

    cy.get('input[name="name"]').clear().type('John Doe')
    cy.get('#registerBtn').click()
    cy.get('#nameValidationText').should('not.be.visible')

    cy.get('input[name="email"]').clear().type('invalid')
    cy.get('#registerBtn').click()
    cy.get('#emailValidationText').should('contain', 'Please enter a valid E-Mail')

    cy.get('input[name="email"]').clear().type('invalid@invalid@mail.com')
    cy.get('#registerBtn').click()
    cy.get('#emailValidationText').should('contain', 'Please enter a valid E-Mail')

    cy.get('input[name="email"]').clear().type('mail.de')
    cy.get('#registerBtn').click()
    cy.get('#emailValidationText').should('contain', 'Please enter a valid E-Mail')

    cy.get('input[name="email"]').clear().type('    ')
    cy.get('#registerBtn').click()
    cy.get('#emailValidationText').should('contain', 'E-Mail is required')

    cy.get('input[name="email"]').clear().type('valid@mail.com')
    cy.get('#registerBtn').click()
    cy.get('#emailValidationText').should('not.be.visible')

    cy.get('input[name="password"]').clear().type(' ')
    cy.get('#registerBtn').click()
    cy.get('#passwordValidationText').should('contain', 'Password is too short. (Minimum length is 6)')

    cy.get('input[name="password"]').clear().type('abcd')
    cy.get('#registerBtn').click()
    cy.get('#passwordValidationText').should('contain', 'Password is too short. (Minimum length is 6)')

    cy.get('input[name="password"]').clear().type('qwertz')
    cy.get('#registerBtn').click()
    cy.get('#passwordValidationText').should('not.be.visible')

    cy.get('input[name="password"]').clear().type('qwertz')
    cy.get('input[name="passwordconfirm"]').clear().type(' ')
    cy.get('#registerBtn').click()
    cy.get('#passwordConfirmValidationText').should('contain', 'Password confirm does not match with password')

    cy.get('input[name="password"]').clear().type('qwertz')
    cy.get('input[name="passwordconfirm"]').clear().type('QWERTZ')
    cy.get('#registerBtn').click()
    cy.get('#passwordConfirmValidationText').should('contain', 'Password confirm does not match with password')

    cy.get('input[name="password"]').clear().type('qwertz')
    cy.get('input[name="passwordconfirm"]').clear().type('qwertz')
    cy.get('#passwordConfirmValidationText').should('not.be.visible')
  })

  it('Register an account with valid data', () => {
    cy.visit('/register')
    cy.get('input[name="name"]').type('EndToEndTest User')
    cy.get('input[name="email"]').type(Cypress.env('TEST_USER_EMAIL'))
    cy.get('input[name="password"]').type(Cypress.env('TEST_USER_PW'))
    cy.get('input[name="passwordconfirm"]').type(Cypress.env('TEST_USER_PW'))

    cy.get('#nameValidationText').should('not.be.visible')
    cy.get('#emailValidationText').should('not.be.visible')
    cy.get('#passwordValidationText').should('not.be.visible')
    cy.get('#passwordConfirmValidationText').should('not.be.visible')

    cy.get('#registerBtn').click()
    cy.wait(1000)
    cy.get('ion-card-header').should('contain', 'Login')
  })

  it('Register an account with an existing email', () => {
    cy.visit('/register')
    cy.get('input[name="name"]').type('EndToEndTest User')
    cy.get('input[name="email"]').type(Cypress.env('TEST_USER_EMAIL'))
    cy.get('input[name="password"]').type(Cypress.env('TEST_USER_PW'))
    cy.get('input[name="passwordconfirm"]').type(Cypress.env('TEST_USER_PW'))

    cy.get('#nameValidationText').should('not.be.visible')
    cy.get('#emailValidationText').should('not.be.visible')
    cy.get('#passwordValidationText').should('not.be.visible')
    cy.get('#passwordConfirmValidationText').should('not.be.visible')

    cy.get('#registerBtn').click()
    cy.wait(1000)
    cy.get('ion-card-header').should('contain', 'Register') // hasn't changed page
  })

  it('Login with existing account', () => {
    cy.visit('/login')
    cy.get('#email').type(Cypress.env('TEST_USER_EMAIL'))
    cy.get('#password').type(Cypress.env('TEST_USER_PW'))
    cy.get('#emailValidationText').should('not.be.visible')
    cy.get('#passwordValidationText').should('not.be.visible')
    cy.get('#loginBtn').click()
    cy.wait(1000)
    cy.get('ion-card-header').should('contain', 'Setup')
  })

})
