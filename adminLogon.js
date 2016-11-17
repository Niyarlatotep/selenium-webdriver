const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');

test.describe('First selenium test', function() {
  let driver;

  const adminPage = 'http://10.0.9.8/litecart/admin/'; //!!!CHANGE TO LOCALHOST
  const adminLogin = 'admin';
  const adminPass = 'admin';

  test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
  });

  test.it('Check title', function*() {
    yield driver.get(adminPage);
    yield driver.findElement(By.name('username')).sendKeys(adminLogin);
    yield driver.findElement(By.name('password')).sendKeys(adminPass);
    yield driver.findElement(By.name('login')).click();
  });

  test.after(() => driver.quit());
});
