describe("Login Functionality", () => {
  // Turn off uncaught exception handling for this test suite
  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  it("should display an error for invalid login credentials", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type("invalidEmail@gmail.com");
    cy.get('input[name="password"]').type("invalidPassword");
    cy.get('button[type="submit"]').click();
    // Check for toast notification instead of error message div
    cy.get(".Toastify__toast--error").should("be.visible");
    cy.get(".Toastify__toast--error").should(
      "contain",
      "Invalid email or password"
    );
  });

  it("should successfully login with valid credentials", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(Cypress.env("testUser"));
    cy.get('input[name="password"]').type(Cypress.env("testPassword"));
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/");
  });

  it("should successfully logout after login", () => {
    cy.get('[data-testid="account-modal"]').should("be.visible").click();
    cy.get('[data-testid="logout-button"]').should("be.visible").click();
    cy.url().should("include", "/login");
    cy.get('input[name="email"]').should("be.visible");
  });
});
