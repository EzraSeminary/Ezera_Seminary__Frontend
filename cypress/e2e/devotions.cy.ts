describe("Devotions Functionality", () => {
  before(() => {
    // Login before test suite to ensure user is authenticated
    cy.login();
  });

  it("should open today's devotion and display all of the selected month's devotions", () => {
    // Step 1: Click on Devotion link
    cy.get('[data-testid="devotion-link"]').should("be.visible").click();

    // Step 2: Verify Devotion page is visible
    cy.get('[data-testid="devotion-page"]').should("be.visible");

    // Step 3: Click on the first devotion month folder
    cy.get('[data-testid="devotion-month-folder"]')
      .first()
      .scrollIntoView()
      .should("be.visible")
      .click();

    // Step 4: Verify devotion month folder content is visible
    cy.get('[data-testid="devotion-month-folder-content"]')
      .scrollIntoView()
      .should("be.visible");
  });
});
