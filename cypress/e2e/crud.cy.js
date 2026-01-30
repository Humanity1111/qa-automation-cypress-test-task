/// <reference types="cypress" />

describe('Адресный фонд - CRUD операции с районами', () => {
  Cypress.on('uncaught:exception', () => false);

  beforeEach(() => {
    cy.visit('https://demo.app.stack-it.ru/fl/');
    cy.get('[data-cy="login"]').type('DEMOWEB');
    cy.get('[data-cy="password"]').type('awdrgy');
    cy.get('[data-cy="submit-btn"]').click();
    cy.get('[data-test-id="Адреса проживающих"]', { timeout: 15000 })
      .should('be.visible')
      .click({ force: true });
  });

  it('1. Проверка диалогового окна', () => {
    cy.get('[data-cy="btn-add"]').click();
    cy.contains('.v-list-item__title', 'Район').click({ force: true });
    
    cy.get('[data-cy="stack-input"]').first().should('be.visible');
    cy.get('[data-cy="btn-save"]').should('be.visible');
    cy.get('[data-cy="btn-cancel"]').should('be.visible');
    
    cy.get('[data-cy="btn-cancel"]').click();
  });

  it('2. Добавление района', () => {
    const districtName = `Район тест ${Date.now()}`;
    
    cy.get('[data-cy="btn-add"]').click();
    cy.contains('.v-list-item__title', 'Район').click({ force: true });
    cy.get('[data-cy="stack-input"]').first().type(districtName);
    cy.get('[data-cy="btn-save"]').click();
    
    cy.contains(districtName).should('exist');
  });

  it('3. Проверка в таблице', () => {
    const testName = `Таблица тест ${Date.now()}`;
    
    cy.get('[data-cy="btn-add"]').click();
    cy.contains('.v-list-item__title', 'Район').click({ force: true });
    cy.get('[data-cy="stack-input"]').first().type(testName);
    cy.get('[data-cy="btn-save"]').click();
    
    cy.get('table').should('contain', testName);
  });

  it('4. Редактирование района', () => {
  const oldName = `Редакт ${Date.now()}`;
  const newName = `Изменён ${Date.now()}`;
  
  cy.get('[data-cy="btn-add"]').click();
  cy.contains('.v-list-item__title', 'Район').click({ force: true });
  cy.get('[data-cy="stack-input"]').first().type(oldName);
  cy.get('[data-cy="btn-save"]').click();
  
  cy.contains(oldName, { timeout: 10000 }).should('exist');
  
  cy.contains('tr', oldName).within(() => {
    cy.get('svg path[d*="M20.71"]').click({ force: true });
  });
  
  cy.get('[data-cy="stack-input"]').first()
    .clear()
    .type(newName)
    .should('have.value', newName);

  cy.get('[tabindex="-1"] > [data-cy="stack-table"] > .table-resizable > .v-data-table__wrapper').click();  
  cy.get('[data-cy="btn-save"]').click();
  
  cy.contains(newName, { timeout: 10000 }).should('exist');
  cy.contains(oldName, { timeout: 5000 }).should('not.exist');
});




  it('5. Удаление района', () => {
    const deleteName = `Удалить ${Date.now()}`;
    
    cy.get('[data-cy="btn-add"]').click();
    cy.contains('.v-list-item__title', 'Район').click({ force: true });
    cy.get('[data-cy="stack-input"]').first().type(deleteName);
    cy.get('[data-cy="btn-save"]').click();
    
    cy.contains('tr', deleteName).within(() => {
      cy.get('input[type="checkbox"]').check({ force: true });
    });
    
    cy.get('[data-cy="btn-delete"]').click();
    cy.get('[data-cy="btn-yes"]').click();
    
    cy.contains(deleteName).should('not.exist');
  });
});
