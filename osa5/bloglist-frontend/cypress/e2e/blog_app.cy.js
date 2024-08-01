describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = {
      name: 'Kalle Käyttäjä',
      username: 'kayttaja1',
      password: 'salainen'
    }
    const user2 = {
      name: 'Matti Meikäläinen',
      username: 'meikalainen',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user1)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.wait(1000)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.get('input[name="Username"]')
    cy.get('input[name="Password"]')
    cy.get('button[type="submit"]').contains('login')
  })

  it('login succeeds', function() {
    cy.get('input[name="Username"]').type('kayttaja1')
    cy.get('input[name="Password"]').type('salainen')
    cy.get('button[type="submit"]').click()

    cy.contains('Kalle Käyttäjä logged in')
  })

  it('login fails with wrong password', function() {
    cy.get('input[name="Username"]').type('pelaaja1')
    cy.get('input[name="Password"]').type('wrong')
    cy.get('button[type="submit"]').click()

    cy.contains('wrong username or password')
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('input[name="Username"]').type('kayttaja1')
      cy.get('input[name="Password"]').type('salainen')
      cy.get('button[type="submit"]').click()
      cy.contains('Kalle Käyttäjä logged in')
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('input[placeholder="Title"]').type('TestiTitle')
      cy.get('input[placeholder="Author"]').type('TestiAuthor')
      cy.get('input[placeholder="URL"]').type('http://testblog.com')
      cy.get('button[type="submit"]').contains('create').click()

      cy.contains('TestiTitle')
      cy.contains('TestiAuthor')
    })

    it('A blog can be liked', function() {
      cy.contains('create new blog').click()
      cy.get('input[placeholder="Title"]').type('TestiTitle')
      cy.get('input[placeholder="Author"]').type('TestiAuthor')
      cy.get('input[placeholder="URL"]').type('http://testblog.com')
      cy.get('button[type="submit"]').contains('create').click()

      cy.contains('TestiTitle')
      cy.contains('TestiAuthor')

      cy.get('#view-button').click()
      cy.contains('likes 0')
      cy.get('#like-button').click()
      cy.contains('likes 1')
    })

    it('A blog can be deleted', function() {
      cy.contains('create new blog').click()
      cy.get('input[placeholder="Title"]').type('TestiTitle')
      cy.get('input[placeholder="Author"]').type('TestiAuthor')
      cy.get('input[placeholder="URL"]').type('http://testblog.com')
      cy.get('button[type="submit"]').contains('create').click()

      cy.contains('TestiTitle')
      cy.contains('TestiAuthor')

      cy.get('#view-button').click()
      cy.get('#remove-button').click()
      cy.contains('TestiTitle').should('not.exist')
      cy.contains('TestiAuthor').should('not.exist')
    })
    it('Only the user who created the blog can see the remove button', function() {
      cy.contains('create new blog').click()
      cy.get('input[placeholder="Title"]').type('TestiTitle')
      cy.get('input[placeholder="Author"]').type('TestiAuthor')
      cy.get('input[placeholder="URL"]').type('http://testblog.com')
      cy.get('button[type="submit"]').contains('create').click()

      cy.contains('TestiTitle')
        .parent()
        .find('#view-button')
        .click()
      cy.get('#remove-button').should('be.visible')

      cy.get('#logout-button').click()

      cy.get('input[name="Username"]').type('meikalainen')
      cy.get('input[name="Password"]').type('salasana')
      cy.get('button[type="submit"]').click()
      cy.contains('Matti Meikäläinen logged in')


      cy.contains('TestiTitle')
      cy.contains('TestiAuthor')
        .parent()
        .find('#view-button')
        .click()
      cy.contains('#remove-button').should('not.exist')
    })

    it('Blogs are ordered by likes', function() {
      cy.contains('create new blog').click()
      cy.get('input[placeholder="Title"]').type('Eka Blogi')
      cy.get('input[placeholder="Author"]').type('Eka Author')
      cy.get('input[placeholder="URL"]').type('http://ekablogi.com')
      cy.get('button[type="submit"]').contains('create').click()

      cy.contains('create new blog').click()
      cy.get('input[placeholder="Title"]').type('Toka Blogi')
      cy.get('input[placeholder="Author"]').type('Toka Author')
      cy.get('input[placeholder="URL"]').type('http://tokablogi.com')
      cy.get('button[type="submit"]').contains('create').click()

      cy.contains('create new blog').click()
      cy.get('input[placeholder="Title"]').type('Kolmas Blogi')
      cy.get('input[placeholder="Author"]').type('Kolmas Author')
      cy.get('input[placeholder="URL"]').type('http://kolmasblogi.com')
      cy.get('button[type="submit"]').contains('create').click()

      cy.contains('Eka Blogi').parent().find('#view-button').click()
      cy.contains('Eka Blogi').parent().find('#like-button').as('ekaBlogiLike')
      cy.get('@ekaBlogiLike').click()
      cy.wait(500)
      cy.get('@ekaBlogiLike').click()

      cy.contains('Toka Blogi').parent().find('#view-button').click()
      cy.contains('Toka Blogi').parent().find('#like-button').as('tokaBlogiLike')
      cy.get('@tokaBlogiLike').click()
      cy.wait(500)
      cy.get('@tokaBlogiLike').click()
      cy.wait(500)
      cy.get('@tokaBlogiLike').click()

      cy.contains('Kolmas Blogi').parent().find('#view-button').click()
      cy.contains('Kolmas Blogi').parent().find('#like-button').as('komasBlogiLike')
      cy.get('@komasBlogiLike').click()

      cy.get('.blog').eq(0).should('contain', 'Toka Blogi')
      cy.get('.blog').eq(1).should('contain', 'Eka Blogi')
      cy.get('.blog').eq(2).should('contain', 'Kolmas Blogi')
    })

  })
})