describe("Login Functionality", () => {
  // Turn off uncaught exception handling for this test suite
  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  it("should display an error for invalid login credentials", () => {
    cy.log("Visiting login page");
    cy.visit("/login");

    cy.log("Waiting for page transition");
    cy.wait(2000);

    cy.log("Typing invalid email");
    cy.get('input[name="email"]').type("invalidEmail@gmail.com");

    cy.log("Typing invalid password");
    cy.get('input[name="password"]').type("invalidPassword");

    cy.log("Clicking submit button");
    cy.get('button[type="submit"]').click();

    cy.log("Checking that error toast is visible");
    cy.get(".Toastify__toast--error").should("be.visible");

    cy.log("Verifying the error message content");
    cy.get(".Toastify__toast--error").should(
      "contain",
      "Invalid email or password"
    );
  });

  it("should successfully login with valid credentials", () => {
    cy.log("Visiting login page");
    cy.visit("/login");

    cy.log("Waiting for page transition");
    cy.wait(2000);

    cy.log("Typing valid email");
    cy.get('input[name="email"]').type(Cypress.env("testUser"));

    cy.log("Typing valid password");
    cy.get('input[name="password"]').type(Cypress.env("testPassword"));

    cy.log("Clicking submit button");
    cy.get('button[type="submit"]').click();

    cy.log("Waiting for navigation after login");
    cy.wait(3000);

    cy.log("Verifying the URL is the base URL");
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
