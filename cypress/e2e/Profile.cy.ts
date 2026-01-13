describe('Profile Component', () => {
  beforeEach(() => {
    cy.visit('/profile');
  });

  it('toggles edit mode', () => {
    cy.contains('button', 'Edit Profile').click();
    cy.contains('button', 'Save Changes').should('be.visible');
  });

  it('opens avatar modal', () => {
    cy.contains('button', 'Edit Profile').click();
    cy.get('[data-testid="avatar-camera-button"]').click();
    cy.contains('Update Profile Picture').should('be.visible');
    cy.contains('button', 'Close').click();
  });

  it('opens add skill modal', () => {
    cy.contains('button', 'Skills').click();
    cy.get('[data-testid="add-skill-button"]').click();
    cy.contains('Add New Skill').should('be.visible');
    cy.contains('button', 'Close').click();
  });

  it('opens add credential modal', () => {
    cy.contains('button', 'Credentials').click();
    cy.get('[data-testid="add-credential-button"]').click();
    cy.contains('Add Credential').should('be.visible');
    cy.contains('button', 'Close').click();
  });

  it('toggles notifications', () => {
    cy.contains('button', 'Settings').click();
    // Assuming first toggle is enabled (indigo)
    cy.get('[data-testid="notification-toggle-0"]').should('have.class', 'bg-indigo-500');
    cy.get('[data-testid="notification-toggle-0"]').click();
    // Should become disabled (gray)
    cy.get('[data-testid="notification-toggle-0"]').should('not.have.class', 'bg-indigo-500');
  });
});
