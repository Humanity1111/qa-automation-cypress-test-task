/// <reference types="cypress" />

describe('BUG: Логин форма не рендерится', () => {
  it('Иногда страница загружается без поля логина', () => {
    cy.visit('https://demo.app.stack-it.ru/fl/', {
      timeout: 120000,
      failOnStatusCode: false,
    })

    cy.get('body', { timeout: 60000 }).then($body => {
      const loginField = $body.find('input[aria-label="Логин"]')

      if (!loginField.length) {
        cy.log('BUG: форма логина не отрисовалась')
        expect(loginField.length, 'Login field missing').to.eq(1)
      }
    })
  })
})
