/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(email?: string, password?: string): Chainable<void>;
  }
}

// ***********************************************
// This example commands.ts shows you how to
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
Cypress.Commands.add("login", (email?: string, password?: string) => {
  cy.log("Turning off uncaught exception handling for login command");
  Cypress.on("uncaught:exception", (_err, _runnable) => {
    return false;
  });

  cy.log("Selecting email and password for login");
  const testEmail = email || Cypress.env("testUser");
  const testPassword = password || Cypress.env("testPassword");

  cy.log("Visiting login page");
  cy.visit("/login");

  cy.log("Waiting for page transition");
  cy.wait(2000);

  cy.log(`Typing email: ${testEmail}`);
  cy.get('input[name="email"]').type(testEmail);

  cy.log(`Typing password`);
  cy.get('input[name="password"]').type(testPassword);

  cy.log("Clicking submit button");
  cy.get('button[type="submit"]').click();

  cy.log("Waiting for navigation after login");
  cy.wait(3000);

  cy.log("Verifying successful login by checking URL");
  cy.url().should((url) => {
    const normalizedUrl = url.replace(/\/$/, "");
    const baseUrl = (Cypress.config("baseUrl") as string).replace(/\/$/, "");
    expect(normalizedUrl).to.equal(baseUrl);
  });
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
