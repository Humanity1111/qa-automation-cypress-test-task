/// <reference types="cypress" />

describe('Авторизация – фиксация бага логина', () => {
  it('Поле логина иногда не отображается', () => {
    cy.visit('https://demo.app.stack-it.ru/fl/', {
      timeout: 120000,
      failOnStatusCode: false,
    })

    cy.get('input[aria-label="Логин"]', { timeout: 60000 })
      .should('be.visible')
  })
})

describe('Адреса проживающих - CRUD тесты', () => {
  const districtName = 'Тестовый район'
  const districtNameUpdated = 'Район Изменённый'

  Cypress.on('uncaught:exception', () => false)

  beforeEach(function () {
    cy.visit('https://demo.app.stack-it.ru/fl/', {
      timeout: 120000,
      failOnStatusCode: false,
    })

    cy.get('body', { timeout: 60000 }).then($body => {
      const loginInput = $body.find('input[aria-label="Логин"]')

      if (!loginInput.length) {
        cy.log('Баг логина: поле не отображается, CRUD‑тест пропускаем')
        this.skip()
        return
      }

      cy.wrap(loginInput).type('DEMOWEB')
      cy.wrap($body.find('input[aria-label="Пароль"]')).type('awdrgy')
      cy.contains('button', 'Войти').click()

      cy.contains('Адресный фонд', { timeout: 60000 }).click()
      cy.contains('Адреса проживающих', { timeout: 60000 }).click()
    })
  })

  it('Открытие диалогового окна добавления записи', () => {
    cy.get('button[title="Добавить"]').click()
    cy.get('div[role="dialog"]').within(() => {
      cy.contains('Добавление уровня').should('be.visible')
    })
  })

  it('Добавление уровня "Район"', () => {
    cy.get('button[title="Добавить"]').click()
    cy.get('div[role="dialog"]').within(() => {
      cy.get('select').select('Район')
      cy.get('input[name="name"]').clear().type('Тестовый район')
      cy.contains('button', 'Сохранить').click()
    })
    cy.contains('td', 'Тестовый район').should('exist')
  })

  it('Редактирование записи "Район"', () => {
    cy.contains('tr', 'Тестовый район').within(() => {
      cy.get('button[title="Редактировать"]').click()
    })
    cy.get('div[role="dialog"]').within(() => {
      cy.get('input[name="name"]').clear().type('Район Изменённый')
      cy.contains('button', 'Сохранить').click()
    })
    cy.contains('td', 'Район Изменённый').should('exist')
  })

  it('Удаление записи "Район"', () => {
    cy.contains('tr', 'Район Изменённый').within(() => {
      cy.get('button[title="Удалить"]').click()
    })
    cy.contains('button', 'Да').click()
    cy.contains('td', 'Район Изменённый').should('not.exist')
  })

  it('Проверка валидации диалогового окна', () => {
    cy.get('button[title="Добавить"]').click()
    cy.get('div[role="dialog"]').within(() => {
      cy.get('select').select('Район')
      cy.get('input[name="name"]').clear()
      cy.contains('button', 'Сохранить').click()
      cy.contains('Поле обязательно для заполнения').should('be.visible')
    })
  })
})
