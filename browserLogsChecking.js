const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const expect = require('chai').expect;

test.describe('Browser logs', function() {
    let driver;
    const homePage = 'http://172.14.14.128/litecart/'; //!!!CHANGE TO LOCALHOST
    const adminPage = homePage + 'admin/';
    const adminLogin = 'admin';
    const adminPass = 'admin';

    function adminLogon() {
        driver.get(adminPage);
        driver.findElement(By.name('username')).sendKeys(adminLogin);
        driver.findElement(By.name('password')).sendKeys(adminPass);
        driver.findElement(By.name('login')).click();
    }

    test.before(function *() {

        driver = yield new Builder()
            .forBrowser('chrome')
            .build();
        adminLogon();
    });

    test.it('Checks browser logs', function*() {
        const catalogPage = homePage + 'admin/?app=catalog&doc=catalog&category_id=1';

        function _getByName(name) {
            return driver.findElement(By.name(name))
        }

        function _getByCss(name) {
            return driver.findElement(By.css(name))
        }

        function _getMayByCss(name) {
            return driver.findElements(By.css(name))
        }

        function _getByXpath(name) {
            return driver.findElement(By.xpath(name))
        }

        function getCatalogPage() {
            return driver.get(catalogPage);
        }

        function getProductsNumber() {
            return _getMayByCss('.row')
                .then(rows => { return rows.length })
        }

        function openProduct(row) {
            return _getByCss('tbody .row:nth-child('+ row +') a').click();
        }

        function getLogs() {
            return driver.manage().logs().get('browser');
        }

        yield getCatalogPage();
        for (let i = yield getProductsNumber(); i>4; i--){
            let currentProduct = yield openProduct(i);
            let currentLogs = yield getLogs();
            expect(currentLogs.length).to.equal(0, ' В логах браузера содержатся сообщения, при открытии товара из строки ' + i);
            yield getCatalogPage();
        }
    });

    test.after(() => driver.quit());
});
