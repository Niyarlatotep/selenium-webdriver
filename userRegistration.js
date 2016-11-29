const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const expect = require('chai').expect;

test.describe('User registration', function() {
    let driver;
    const homePage = 'http://10.0.9.104/litecart/'; //!!!CHANGE TO LOCALHOST

    test.before(function *() {

        driver = yield new Builder()
            .forBrowser('chrome')
            .build();
    });

    test.it('Check new user registration', function*() {
        const registrationPage = homePage + 'en/create_account';
        const firstUserName = 'Ivan';
        const lastUserName = 'Ivanov';
        const address = 'Москва, Кремль';
        const postCode = '111222';
        const city = 'Moscow';
        const email = makeEmail();
        const phone = '78002000600';
        const password = 'password';

        function makeEmail() {
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( let i=0; i < 5; i++ ){
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text + '@ya.ru';
        }

        function getHomePage() {
            return driver.get(registrationPage);
        }
        
        function _getByName(name) {
            return driver.findElement(By.name(name))
        }

        function createNewAccount() {
            _getByName('firstname').sendKeys(firstUserName);
            _getByName('lastname').sendKeys(lastUserName);
            _getByName('address1').sendKeys(address);
            _getByName('postcode').sendKeys(postCode);
            _getByName('city').sendKeys(city);
            _getByName('email').sendKeys(email);
            _getByName('phone').sendKeys(phone);
            _getByName('password').sendKeys(password);
            _getByName('confirmed_password').sendKeys(password);
            _getByName('create_account').click();
        }
        
        function logout() {
            return driver.findElement(By.css('#box-account ul li:last-child a')).click();
        }
        
        function logon() {
            _getByName('email').sendKeys(email);
            _getByName('password').sendKeys(password);
            _getByName('login').click();
        }

        //TEST
        getHomePage();
        createNewAccount();
        logout();
        logon();
        logout();
    });

    test.after(() => driver.quit());
});
