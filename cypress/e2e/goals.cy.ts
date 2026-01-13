describe('Goals Management', () => {
  beforeEach(() => {
    // 1. Visit Login
    cy.visit('http://localhost:3000/');

    // 2. Log in as an Admin/Manager to see more features (like Team Goals)
    // We'll search for 'Samuel' who is usually an admin in the mock data
    cy.get('input[placeholder="Search people, roles, or departments..."]').type('Samuel');
    cy.get('h3').contains('Samuel').click();
    cy.contains('button', 'Continue').click();

    // 3. Navigate to Goals
    cy.get('nav').contains('Goals').click();
    cy.url().should('include', '/goals');
  });

  it('should display the goals dashboard with stats', () => {
    cy.contains('h1', 'Goals').should('be.visible');
    cy.contains('My Goals').should('be.visible');
    cy.contains('Team Goals').should('be.visible');
    cy.contains('On Track').should('be.visible');
  });

  it('should allow creating a new personal goal', () => {
    const goalTitle = 'Complete QA Automation Suite';
    const goalDesc = 'Create comprehensive E2E tests for the entire application.';

    cy.contains('button', 'Add Goal').click();

    // Fill the modal
    cy.get('input[placeholder="Enter goal title..."]').type(goalTitle);
    cy.get('textarea[placeholder="Describe your goal..."]').type(goalDesc);
    cy.get('select').select('High');

    cy.contains('button', 'Create Goal').click();

    // Verify it appears in the list
    cy.contains(goalTitle).should('be.visible');
    cy.contains(goalDesc).should('be.visible');
  });

  it('should allow updating the progress of an existing goal', () => {
    // Find a goal card and click Update Progress
    // We'll look for any card's update button
    cy.get('button').contains('Update Progress').first().click();

    // The modal should open
    cy.contains('Update:').should('be.visible');

    // Change progress using the slider (range input)
    // Invoking 'val' and triggering 'change' is most reliable for range inputs in Cypress
    cy.get('input[type="range"]').invoke('val', 80).trigger('change');

    // Verify the percentage text updates (it shows "80%" in a large font)
    cy.contains('80%').should('be.visible');

    cy.contains('button', 'Save Progress').click();

    // Modal should close
    cy.contains('Update:').should('not.exist');
  });

  it('should switch between My Goals and Team Goals', () => {
    // Click Team Goals tab
    cy.contains('button', 'Team Goals').click();

    // Verify team goal specific indicators (like owner avatar) exist if there are team goals
    // The GoalCard shows owner if showOwner is true (which it is for team tab)
    // Check if an img exists within the goals grid
    cy.get('div.grid').find('img').should('have.length.at.least', 1);

    // Switch back
    cy.contains('button', 'My Goals').click();
    // In My Goals, owner info is hidden by default in the code
    cy.get('div.grid').find('img').should('have.length', 0);
  });
});
