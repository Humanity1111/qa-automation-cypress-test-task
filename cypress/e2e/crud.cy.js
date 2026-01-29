/// <reference types="cypress" />

describe('CRUD tests — Адреса проживающих', () => {
  const districtName = 'Тестовый район'
  const districtNameUpdated = 'Район Изменённый'

  Cypress.on('uncaught:exception', () => false)

  beforeEach(() => {
    cy.visit('https://demo.app.stack-it.ru/fl/', {
      timeout: 120000,
      failOnStatusCode: false,
    })

    cy.get('body', { timeout: 60000 }).then($body => {

      if ($body.find('input[aria-label="Логин"]').length) {
        cy.log('Login form detected — performing login')

        cy.get('input[aria-label="Логин"]').type('DEMOWEB')
        cy.get('input[aria-label="Пароль"]').type('awdrgy')
        cy.contains('button', 'Войти').click()
      }

      cy.get('body').then($app => {
        const hasMenu = $app.text().includes('Адресный фонд')

        if (!hasMenu) {
          cy.screenshot('APP_NOT_LOADED')
          throw new Error('APP BROKEN: main interface not rendered')
        }
      })
    })

    cy.contains('Адресный фонд', { timeout: 60000 }).click()
    cy.contains('Адреса проживающих', { timeout: 60000 }).click()
    cy.get('table', { timeout: 60000 }).should('be.visible')
  })

  it('Открытие диалога добавления', () => {
    cy.get('button[title="Добавить"]').click()
    cy.get('div[role="dialog"]').should('be.visible')
  })

  it('Добавление записи', () => {
    cy.get('button[title="Добавить"]').click()
    cy.get('div[role="dialog"]').within(() => {
      cy.get('select').select('Район')
      cy.get('input[name="name"]').clear().type(districtName)
      cy.contains('button', 'Сохранить').click()
    })
    cy.contains('td', districtName).should('exist')
  })

  it('Редактирование записи', () => {
    cy.contains('tr', districtName).within(() => {
      cy.get('button[title="Редактировать"]').click()
    })
    cy.get('input[name="name"]').clear().type(districtNameUpdated)
    cy.contains('button', 'Сохранить').click()
    cy.contains('td', districtNameUpdated).should('exist')
  })

  it('Удаление записи', () => {
    cy.contains('tr', districtNameUpdated).within(() => {
      cy.get('button[title="Удалить"]').click()
    })
    cy.contains('button', 'Да').click()
    cy.contains('td', districtNameUpdated).should('not.exist')
  })

  it('Проверка валидации формы', () => {
    cy.get('button[title="Добавить"]').click()
    cy.get('div[role="dialog"]').within(() => {
      cy.get('select').select('Район')
      cy.get('input[name="name"]').clear()
      cy.contains('button', 'Сохранить').click()
      cy.contains('Поле обязательно для заполнения').should('be.visible')
    })
  })
})
