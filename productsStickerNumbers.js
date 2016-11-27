const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const expect = require('chai').expect;

test.describe('Products stickers', function() {
    let driver;
    const homePage = 'http://10.0.9.48/litecart'; //!!!CHANGE TO LOCALHOST
    const adminLogin = 'admin';
    const adminPass = 'admin';

    test.before(function *() {

        driver = yield new Builder()
            .forBrowser('chrome')
            .build();
    });

    test.it('Check products sticker numbers', function*() {
        function getProductNumbers() {
            return driver.findElements(By.css('.product')).then(products=>{
                return products.length;
            })
        }

        function getProductsStickerNumbers() {
            return driver.findElements(By.css('.product .sticker')).then(products=>{
                return products.length;
            })
        }

        driver.get(homePage);
        let productNumbers  = yield getProductNumbers();
        let productsStickerNumbers  = yield getProductsStickerNumbers();
        expect(productNumbers).to.equal(productsStickerNumbers,
            'Количество стикеров не соответствует количеству продуктов')
    });

    test.after(() => driver.quit());
});
