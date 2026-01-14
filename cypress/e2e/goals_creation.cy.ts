describe('Goal Creation & Management', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Samuel Carter').click();
    cy.contains('button', 'Continue').click();
    cy.visit('/goals');
  });

  it('allows creating, persisting, and updating a detailed goal', () => {
    // 1. Create Goal
    cy.contains('button', 'Add Goal').click();
    cy.get('input[placeholder*="Enter goal title"]').type('Master Supabase RLS');
    cy.get('textarea[placeholder*="Describe your goal"]').type(
      'Implement strict security policies.'
    );

    // Select Priority
    cy.get('select').first().select('High');

    // Select Category (New)
    cy.get('select').eq(1).select('Technical');

    // Set Due Date
    cy.get('input[type="date"]').type('2026-12-31');

    cy.contains('button', 'Create Goal').click();

    // Verify Optimistic UI
    cy.contains('Master Supabase RLS').should('be.visible');
    cy.contains('High').should('be.visible');
    cy.contains('Technical').should('be.visible');

    // Allow mock persistence to finish (300ms delay in GoalService)
    cy.wait(1000);

    // 2. PROVE Persistence: Reload the page
    cy.reload();
    cy.contains('Master Supabase RLS', { timeout: 10000 }).should('be.visible');
    cy.contains('High').should('be.visible');

    // 3. Update Progress
    cy.contains('div', 'Master Supabase RLS')
      .parents('.bg-white, .dark\\:bg-slate-800')
      .first()
      .within(() => {
        cy.contains('button', 'Update Progress').click();
      });

    // Change slider
    cy.get('input[type="range"]').then($range => {
      const range = $range[0] as HTMLInputElement;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(range, 50);
      range.dispatchEvent(new Event('input', { bubbles: true }));
      range.dispatchEvent(new Event('change', { bubbles: true }));
    });

    cy.contains('button', 'Save Progress').click();

    // Allow update persistence
    cy.wait(1000);

    // Check card update
    cy.contains('50%', { timeout: 10000 }).should('be.visible');

    // Final Reload to confirm update persistence
    cy.reload();
    cy.contains('50%').should('be.visible');
  });
});
