const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const expect = require('chai').expect;

test.describe('Admin page', function() {
    let driver;

    test.before(function *() {
        driver = yield new Builder()
            .forBrowser('chrome')
            .build();
    });

    test.it('Check menu tabs headers', function*() {
        const countriesPage = 'http://172.14.14.128/litecart/admin/?app=countries&doc=countries';
        const adminLogin = 'admin';
        const adminPass = 'admin';

        function _getByName(name) {
            return driver.findElement(By.name(name))
        }

        function _getByCss(css) {
            return driver.findElement(By.css(css))
        }

        function _getManyByCss(css) {
            return driver.findElements(By.css(css))
        }

        function _getByXpath(xpath) {
            return driver.findElement(By.xpath(xpath))
        }

        function getLinks() {
            return driver.findElements(By.css('.fa-external-link'));
        }

       function openCountriesSettings() {
           driver.get(countriesPage);
           driver.findElement(By.name('username')).sendKeys(adminLogin);
           driver.findElement(By.name('password')).sendKeys(adminPass);
           driver.findElement(By.name('login')).click();
       }

       function addNewCountry() {
           return _getByCss('#content div a').click();
       }

       function getNewWindow(currentWindow, allWindows) {
           return driver.getAllWindowHandles()
               .then(allWindows=>{ return allWindows.filter(win=>{ return !win.includes(currentWindow) })[0]});
       }
       
       function waitForNewWindow() {
           return driver.wait(_=>{
               return driver.getAllWindowHandles()
                   .then(windows => { return (windows.length != 1) })
           })
       }

        openCountriesSettings();
        addNewCountry();
        let links = yield getLinks();
        for (i=0; i<links.length; i++){
            let currentWindow = yield driver.getWindowHandle();
            links[i].click();
            yield waitForNewWindow();
            driver.switchTo().window(yield getNewWindow(currentWindow));
            driver.close();
            driver.switchTo().window(currentWindow);
        }
    });

    test.after(() => driver.quit());
});