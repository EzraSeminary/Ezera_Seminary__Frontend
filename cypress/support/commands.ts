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
  // Turn off uncaught exception handling for login
  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  const testEmail = email || Cypress.env("testUser");
  const testPassword = password || Cypress.env("testPassword");

  cy.visit("/login");
  cy.wait(2000);
  cy.get('input[name="email"]').type(testEmail);
  cy.get('input[name="password"]').type(testPassword);
  cy.get('button[type="submit"]').click();
  cy.wait(3000);

  // Verify successful login by checking URL
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
