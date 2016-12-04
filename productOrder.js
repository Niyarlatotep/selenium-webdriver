const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const expect = require('chai').expect;


test.describe('Product order', function() {
    let driver;
    const homePage = 'http://172.14.14.128/litecart/'; //!!!CHANGE TO LOCALHOST

    test.before(function *() {
        driver = yield new Builder()
            .forBrowser('chrome')
            .build();
        driver.manage().timeouts().implicitlyWait(3000)
    });

    test.it('Check products ordering', function*() {
        const products = ['[alt="Green Duck"]', '[alt="Purple Duck"]', '[alt="Red Duck"]'];

        function _getByName(name) {
            return driver.findElement(By.name(name))
        }

        function _getByCss(css) {
            return driver.findElement(By.css(css))
        }

        function _getByXpath(xpath) {
            return driver.findElement(By.xpath(xpath))
        }
        // const productPage = homePage + 'en/rubber-ducks-c-1/subcategory-c-2/green-duck-p-2';

        function openHomepage() {
            return driver.get(homePage);
        }
        
        function openProduct(i) {
            return _getByCss(products[i]).click();
        }

        function addProductToCart() {
            return _getByName('add_cart_product').click();
        }

        function isProductNumbersInCart(numbers) {
            numbers++;
            return _getByXpath('//*[@id="cart"]//*[@class="quantity"][.="'+ numbers +'"]')
                .then(_=> {return true})
                .catch(_=> {return false})
        }

        function checkOut() {
            return _getByCss('#cart a:last-child').click();
        }

        function removeProductFromCart(products) {
            _getByName('remove_cart_item').click();
        }
        
        function getLastProductInCart(i) {
            return _getByXpath('(//td[@class="item"])['+ i +']');
        }
        
        function checkProductRemoved(element) {
            return driver.wait(until.stalenessOf(element), 4000)
                .then(_=>{return true})
                .catch(_=>{return false})
        }

        for (let i=0; i<products.length; i++){
            openHomepage();
            openProduct(i);
            addProductToCart();
            expect(yield isProductNumbersInCart(i)).to.equal(true, ' Количество товаров не соответствует');
        }
        checkOut();
        for (let i=products.length; i; i--){
            let lastProduct = yield getLastProductInCart(i);
            removeProductFromCart();
            expect(yield checkProductRemoved(lastProduct)).to.equal(true, 'Товар не удален из списка');
        }
    });

    test.after(() => driver.quit());
});
