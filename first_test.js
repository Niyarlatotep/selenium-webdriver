const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');

test.describe('First selenium test', function() {
  let driver;

  test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
  });

  test.it('Check title', function*() {
    yield driver.get('http://www.protractortest.org/');
    yield driver.wait(until.titleIs('Protractor - end to end testing for AngularJS'), 1000);
  });

  test.after(() => driver.quit());
});
