describe('Performance Reviews', () => {
  beforeEach(() => {
    // 1. Visit Login
    cy.visit('http://localhost:3000/');

    // 2. Log in as a User who has reviews (most users in mock data do)
    cy.get('input[placeholder="Search people, roles, or departments..."]').type('Samuel');
    cy.get('h3').contains('Samuel').click();
    cy.contains('button', 'Continue').click();

    // 3. Navigate to Reviews
    cy.get('nav').contains('Reviews').click();
    cy.url().should('include', '/reviews');
  });

  it('should display the performance reviews dashboard', () => {
    cy.contains('h1', 'Performance Reviews').should('be.visible');
    cy.contains('Pending Reviews').should('be.visible');
    cy.contains('Average Rating').should('be.visible');
  });

  it('should allow starting and submitting a self-assessment', () => {
    // Check if there is a pending review to start
    cy.contains('Action Required').should('be.visible');
    cy.contains('button', 'Start Review').click();

    // Modal should open
    cy.contains('Performance Review').should('be.visible');
    cy.contains('Self Assessment').should('be.visible');

    // Fill out ratings (using buttons 1-5)
    // There are 5 categories: Performance, Goals Achievement, Skills Growth, Teamwork, Initiative
    // Each has a row with buttons 1, 2, 3, 4, 5.
    // We'll click the '5' button for the first few.
    cy.get('button').contains('5').first().click(); // Performance
    cy.get('button').contains('4').eq(1).click(); // Goals

    // Fill out text areas
    cy.get('textarea[placeholder*="achievements"]').type(
      'Closed 5 major enterprise deals.\nArchitected the new QA strategy.'
    );
    cy.get('textarea[placeholder*="growth"]').type(
      'I would like to improve my public speaking skills.'
    );

    // Submit the review
    cy.contains('button', 'Submit Review').click();

    // Modal should close and the review should now be in History
    cy.contains('Performance Review').should('not.exist');
    cy.contains('Review History').should('be.visible');
    // Verify the latest review is listed in history
    cy.get('div').contains('Review History').parent().contains('CheckCircleIcon').should('exist');
  });

  it('should allow viewing completed review history', () => {
    // Find a completed review in the history section (if any)
    // If none are completed, the previous test would have added one,
    // but tests should ideally be isolated.
    // For now, we assume standard mock data has history.

    cy.get('div').contains('Review History').parent().find('.cursor-pointer').first().click();

    // Check modal for "Your Assessment"
    cy.contains('Your Assessment').should('be.visible');
    cy.contains('Manager Feedback').should('exist');

    cy.contains('button', 'Close').click();
  });
});
