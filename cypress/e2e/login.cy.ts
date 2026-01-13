describe('Login Flow (Profile Picker)', () => {
  beforeEach(() => {
    // Visit the root page
    cy.visit('http://localhost:3000/');
  });

  it('should display the login screen with available profiles', () => {
    cy.contains('h1', 'Choose your profile').should('be.visible');
    cy.contains('p', 'Select who you’re signing in as').should('be.visible');
    cy.get('input[placeholder="Search people, roles, or departments..."]').should('be.visible');
  });

  it('should filter profiles when searching', () => {
    // Search for a specific user known to exist (based on mock data usually available)
    // Assuming "Samuel" is a valid user from the mock data seen in other files or typical setup
    const searchTerm = 'Samuel';

    cy.get('input[placeholder="Search people, roles, or departments..."]').type(searchTerm);

    // Should show results containing the name
    cy.contains(searchTerm).should('be.visible');

    // Clear and search for something likely non-existent
    cy.get('input[placeholder="Search people, roles, or departments..."]')
      .clear()
      .type('NonExistentUser12345');
    cy.contains('No results found').should('be.visible');
  });

  it('should allow selecting a profile and logging in', () => {
    // Determine a selector for a user card.
    // Based on the code: div with onClick handling selection.
    // We can just click the first available user card that isn't the container.
    // Ideally, we look for a specific user name for stability.

    // Ensure button is disabled initially
    cy.contains('button', 'Continue').should('be.disabled');

    // Find and click on a user profile (e.g., the first one listed)
    // The list items have an img with an alt tag of the user's name, or h3 with user name.
    // Let's click the first h3 element in the list.
    cy.get('h3').first().click();

    // Verify button is now enabled
    cy.contains('button', 'Continue').should('not.be.disabled');

    // Click continue
    cy.contains('button', 'Continue').click();

    // Should redirect to dashboard
    // Note: This assumes successful login redirects to /?tab=dashboard or similar, or checking for dashboard content.
    // Since App.tsx usually handles routing, and typical default is dashboard.
    cy.url().should('include', 'dashboard');
    cy.contains('h1', 'Dashboard').should('be.visible');
  });

  it('should toggle workspace/industry selector', () => {
    cy.contains('button', 'Workspace:').click();
    cy.contains('Select Workspace').should('be.visible');

    // Click outside or select an option to close (optional for this basics test)
    // Let's try selecting 'Tech' if available, or just verify the dropdown appears.
    cy.get('button').contains('Tech').click();

    // Dropdown should close
    cy.contains('Select Workspace').should('not.exist');
  });
});
