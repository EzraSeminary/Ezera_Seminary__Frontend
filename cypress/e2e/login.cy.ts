describe("Login Functionality", () => {
  // Turn off uncaught exception handling for this test suite
  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  it("should display an error for invalid login credentials", () => {
    cy.visit("/login");
    cy.wait(2000);
    cy.get('input[name="email"]').type("invalidEmail@gmail.com");
    cy.get('input[name="password"]').type("invalidPassword");
    cy.get('button[type="submit"]').click();
    // Check for toast notification
    cy.get(".Toastify__toast--error").should("be.visible");
    cy.get(".Toastify__toast--error").should(
      "contain",
      "Invalid email or password"
    );
  });

  it("should successfully login with valid credentials", () => {
    cy.visit("/login");
    cy.wait(2000);
    cy.get('input[name="email"]').type(Cypress.env("testUser"));
    cy.get('input[name="password"]').type(Cypress.env("testPassword"));
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.url().should((url) => {
      const normalizedUrl = url.replace(/\/$/, "");
      const baseUrl = (Cypress.config("baseUrl") as string).replace(/\/$/, "");
      expect(normalizedUrl).to.equal(baseUrl);
    });
  });

  // it("should successfully logout after login", () => {
  //   cy.get('[data-testid="account-modal"]').should("be.visible").click();
  //   cy.get('[data-testid="logout-button"]').should("be.visible").click();
  //   cy.url().should("include", "/login");
  //   cy.get('input[name="email"]').should("be.visible");
  // });
});
