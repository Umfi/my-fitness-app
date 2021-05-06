// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;


Cypress.Commands.add("login", (isSetup) => {
    cy.request("POST", Cypress.env('API_BASE_URL')  + 'login', {
        email: Cypress.env('TEST_USER_EMAIL'),
        password: Cypress.env('TEST_USER_PW')
        }).its("body.access_token").should("exist").then(token => {

            Storage.set({
                key: "access_token",
                value: JSON.stringify(token)
            })

            Storage.set({
                key: "is_setup",
                value: JSON.stringify(isSetup)
            });
        });
});
