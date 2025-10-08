describe("Courses Functionality", () => {
  before(() => {
    // Login before test suite to ensure user is authenticated
    cy.login();
  });

  it("should navigate through courses and view course content", () => {
    // Step 1: Click on Courses link
    cy.get('[data-testid="courses-link"]').should("be.visible").click();

    // Step 2: Verify Courses page is visible
    cy.get('[data-testid="courses-page"]').should("be.visible");

    // Step 3: Click on the first open course button
    cy.get('[data-testid="open-course-button"]')
      .first()
      .should("be.visible")
      .click();

    // Step 4: Verify Course chapters page is visible
    cy.get('[data-testid="course-chapters-page"]').should("be.visible");

    // Step 5: Click on open chapter button
    cy.get('[data-testid="open-chapter-button"]').should("be.visible").click();

    // Step 6: Verify Course slides page is visible
    cy.get('[data-testid="course-slides-page"]').should("be.visible");
  });
});
