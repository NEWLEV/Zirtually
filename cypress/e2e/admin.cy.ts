describe('Admin Console Flows', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Samuel Carter').click();
    cy.contains('button', 'Continue').click();
    cy.visit('/admin');
  });

  it('loads the admin dashboard', () => {
    cy.get('h1').contains('Admin Console');
    cy.contains('Employees').should('be.visible');
    cy.contains('Structure').should('be.visible');
  });

  it('can switch tabs', () => {
    cy.contains('Structure (Depts & Positions)').click();
    cy.contains('Job Positions').should('be.visible');

    cy.contains('Global Settings').click();
    cy.contains('Organization Defaults').should('be.visible');
  });

  it('can open the add employee modal', () => {
    cy.contains('+ Add Employee').click();
    cy.get('div[role="dialog"]').should('be.visible');
    cy.contains('Add New Employee').should('be.visible');

    // Test Form Interaction
    cy.get('input[type="email"]').type('test.hire@zirtually.com');
    cy.get('select').first().select('manager');
    cy.contains('Cancel').click();
    cy.get('div[role="dialog"]').should('not.exist');
  });

  it('can create a new department', () => {
    cy.contains('Structure').click();
    cy.contains('+ Add Department').click();

    const deptName = `QA Dept ${Date.now()}`;

    cy.get('input[placeholder*="Engineering"]').type(deptName);
    cy.get('textarea').type('Created by Cypress E2E');
    cy.contains('button', 'Create Department').click();

    // Verify it appears in the list
    cy.wait(1000);
    cy.contains(deptName).should('be.visible');
  });
});
