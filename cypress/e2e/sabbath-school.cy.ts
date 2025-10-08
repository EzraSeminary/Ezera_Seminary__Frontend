describe("Sabbath School Functionality", () => {
  // Turn off uncaught exception handling for this test suite
  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  beforeEach(() => {
    // Login before each test to ensure user is authenticated
    cy.visit("/login");
    cy.wait(2000);
    cy.get('input[name="email"]').type(Cypress.env("testUser"));
    cy.get('input[name="password"]').type(Cypress.env("testPassword"));
    cy.get('button[type="submit"]').click();
    cy.wait(3000);
  });

  it("should navigate to Sabbath School and view current lesson", () => {
    // Step 1: Click on Sabbath School link
    cy.get('[data-testid="sabbath-school-link"]').should("be.visible").click();

    // Step 2: Verify Sabbath School page is visible
    cy.get('[data-testid="sabbath-school-page"]').should("be.visible");

    // Step 3: Click on "View Current Lesson" link
    cy.get('[data-testid="view-current-lesson-link"]')
      .should("be.visible")
      .click();

    // Step 4: Verify Sabbath School day page is visible
    cy.get('[data-testid="sabbath-school-day-page"]').should("be.visible");
  });

  it("should verify Sabbath School navigation flow", () => {
    // Test the complete navigation flow
    cy.get('[data-testid="sabbath-school-link"]').should("be.visible").click();

    // Wait for page to load
    cy.wait(2000);

    // Verify we're on the Sabbath School page
    cy.get('[data-testid="sabbath-school-page"]').should("be.visible");

    // Verify the view current lesson link exists and is clickable
    cy.get('[data-testid="view-current-lesson-link"]')
      .should("be.visible")
      .should("not.be.disabled")
      .click();

    // Wait for navigation
    cy.wait(2000);

    // Verify we're on the Sabbath School day page
    cy.get('[data-testid="sabbath-school-day-page"]').should("be.visible");
  });
});
