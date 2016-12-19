const test = require('selenium-webdriver/testing');
const expect = require('chai').expect;
const products = require('../testingData/products');
const Application = require('../application/application');

let app = new Application('http://172.14.14.128/litecart/');

test.describe('Product ordering', function() {

    test.it('Check products ordering', function*() {

        for (let i=0; i < products.suite1.length; i++){
            let isProductNumbersMatch = yield app.addProductToCart(products.suite1[i], i);
            expect(isProductNumbersMatch).to.equal(true, 'Количество товаров не соответствует');
        }

        for (let i = products.suite1.length; i; i--){
            let isProductRemoved = yield app.removeProductFromCart(i);
            expect(isProductRemoved).to.equal(true, 'Товар не удален из списка');
        }
    });

    test.after(() => driver.quit());
});
