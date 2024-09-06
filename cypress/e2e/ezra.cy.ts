describe("Login Functionality", () => {
  // Turn off uncaught exception handling for this test suite
  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });
  it("should display an error for invalid login credentials", () => {
    cy.visit("https://ezraseminary.org/login/");
    cy.get('input[name="email"]').type("invalidEmail");
    cy.get('input[name="password"]').type("invalidPassword");
    cy.get('button[type="submit"]').click();
  });

  it("should successfully login with valid credentials", () => {
    cy.visit("https://ezraseminary.org/login/");
    cy.get('input[name="email"]').type("validEmail");
    cy.get('input[name="password"]').type("validPassword");
    cy.get('button[type="submit"]').click();
  });
});
