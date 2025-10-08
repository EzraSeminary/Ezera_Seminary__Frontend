describe("Sabbath School Functionality", () => {
  // Turn off uncaught exception handling for this test suite
  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  before(() => {
    // Login before each test to ensure user is authenticated
    cy.login();
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
});
