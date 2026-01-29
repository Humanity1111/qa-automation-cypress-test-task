/// <reference types="cypress" />

describe('BUG: Login form render check', () => {
  it('Login form should render on page load', () => {
    cy.visit('https://demo.app.stack-it.ru/fl/', {
      timeout: 120000,
      failOnStatusCode: false,
    })

    cy.get('body', { timeout: 60000 }).then($body => {
      const hasLogin = $body.find('input[aria-label="Логин"]').length
      const hasPassword = $body.find('input[aria-label="Пароль"]').length
      const hasButton = $body.text().includes('Войти')

      if (!hasLogin || !hasPassword || !hasButton) {
        cy.screenshot('BUG_login_form_not_rendered')
        throw new Error('BUG: Login form did not render')
      }
    })
  })
})
