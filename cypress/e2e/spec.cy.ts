describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
  });
});

describe("My first test practice", () => {
  it("should click the link 'type'", () => {
    cy.visit("https://example.cypress.io");
    cy.contains("type").click();
    cy.url().should("include", "/commands/actions");
    cy.get('input[data-testid="action-email"]').type("fake@email.com");
    cy.get(".action-email").should("have.value", "fake@email.com");
  });
});
