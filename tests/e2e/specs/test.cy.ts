describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
    cy.contains('Inicio de Sesión')
  })
})
