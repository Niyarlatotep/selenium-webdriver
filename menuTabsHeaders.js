const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const expect = require('chai').expect;

test.describe('Admin page', function() {
  let driver;
  const adminPage = 'http://10.0.9.48/litecart/admin/'; //!!!CHANGE TO LOCALHOST
  const adminLogin = 'admin';
  const adminPass = 'admin';

  test.before(function *() {

    driver = yield new Builder()
        .forBrowser('chrome')
        .build();
  });

  test.it('Check menu tabs headers', function*() {

    function getFirstLevelElements() {
      return driver.findElements(By.xpath('//*[@id="app-"]/a/*[contains(@class, "name")]'));
    }

    function getSecondLevelElements() {
      return driver.findElements(By.xpath('//*[contains(@class, "docs")]//*[contains(@class, "name")]'));
    }

    function isHeader(currentLocator) {
      return driver.findElement(By.css('#content h1')).then(()=>{
        expect(true).to.equal(true, 'Не отображается заголовок  при переходе по ссылке ' + currentLocator);
      }).catch(()=>{
        expect(false).to.equal(true, 'Не отображается заголовок  при переходе по ссылке ' + currentLocator);
      })
    }

    function checkInsideElements() {
      getSecondLevelElements()
          .then(secondLevelElements=>{
            secondLevelElements.forEach((_, index)=>{
              index++;
              let currentLocator = '(//*[contains(@class, "docs")]//*[contains(@class, "name")])['+ index +']';
              driver.findElement(By.xpath(currentLocator)).click();
              isHeader(currentLocator);
            });});
    }


    driver.get(adminPage);
    driver.findElement(By.name('username')).sendKeys(adminLogin);
    driver.findElement(By.name('password')).sendKeys(adminPass);
    driver.findElement(By.name('login')).click();
    let firstLevelElements = yield getFirstLevelElements();

    firstLevelElements.forEach((_,index)=>{
      index ++;
      let currentLocator = '(//*[@id="app-"]/a/*[contains(@class, "name")])['+ index +']';
      driver.findElement(By.xpath(currentLocator)).click();
      isHeader(currentLocator);
      checkInsideElements();
    });


  });

  test.after(() => driver.quit());
});
