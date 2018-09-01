// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

const Sequelize = require('sequelize')
const database = new Sequelize('postgres://utente:pass@localhost:5432/dbname')

module.exports = {
  before: function (browser, done) {
    console.log('Setting up...');

    return database.query("TRUNCATE TABLE CONFIG")
      .then(function () {
        return database.query("INSERT INTO public.config (id, title) VALUES (1, 'default test');")
      })
      .then(function () {
        done()
      })
      .catch(function (err) {
        done(err)
      })
  },
  'default test': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    // default: http://localhost:8080
    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementCount('h1', 1)
      .assert.containsText('h1', 'default test')
      .end()
  },
  afterAll: function () {
    database.close();
  }
}
