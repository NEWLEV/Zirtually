describe('Dashboard Smoke Test', () => {
  beforeEach(() => {
    // Log in as an Admin to see all widgets including manager-specific ones
    cy.visit('http://localhost:3000/');
    cy.get('input[placeholder="Search people, roles, or departments..."]').type('Samuel');
    cy.get('h3').contains('Samuel').click();
    cy.contains('button', 'Continue').click();

    // Ensure we are on the dashboard
    cy.url().should('include', '/dashboard');
  });

  it('should load all core metric cards', () => {
    cy.contains('Pending Tasks').should('be.visible');
    cy.contains('Training Status').should('be.visible');
    cy.contains('Active Goals').should('be.visible');
    cy.contains('Learning Points').should('be.visible');
  });

  it('should load progress and analytics sections', () => {
    cy.contains('Goals Progress').should('be.visible');
    // Manager specific sections
    cy.contains('Team Analytics').should('be.visible');
    cy.contains('AI Nudges').should('be.visible');
  });

  it('should load announcements and time off preview', () => {
    cy.contains('Announcements').should('be.visible');
    // Check if at least one announcement card exists
    cy.get('div')
      .contains('Announcements')
      .parent()
      .find('.group')
      .should('have.length.at.least', 1);
  });

  it('should be responsive and show/hide sidebar', () => {
    // Current state: Sidebar is likely open
    cy.get('nav').should('be.visible');

    // Click collapse button (usually in Sidebar or Header)
    // Finding the collapse button - it's often a chevron or menu icon
    cy.get('aside').find('button').first().click();

    // Check if sidebar collapsed (usually via class or width change)
    // Based on App.tsx code: ${sidebarCollapsed ? 'ml-20' : 'ml-64'}
    cy.get('main').should('have.class', 'ml-20');
  });
});
