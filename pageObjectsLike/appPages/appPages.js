require('./../driver/initialization');
const {until} = require('selenium-webdriver');

class MainPage{
    constructor(homepage){
        this._homepage = homepage;
    }
    _product(productName){
        return element.byCss('[alt="'+ productName +'"]')
    }
    go(){
        return driver.get(this._homepage);
    }
    openProduct(productName){
        return this._product(productName).click();
    }
    isProduct(productName){
        return this._product(productName)
            .then(_=>{return true})
            .catch(_=>{return false})
    }
}

class Product{
    _addToCart(){
        return element.byName('add_cart_product');
    }
    _quantity(){
        return element.byName('quantity');
    }
    addToCart(){
        return this._addToCart().click();
    }
    setQuantity(quantity){
        this._quantity().clear();
        this._quantity().sendKeys(quantity);
    }
}

class Cart{
    constructor(homepage){
        this._checkout = homepage + 'checkout';
    }
    _productNumbers(numbers){
        return element.byXpath('//*[@id="cart"]//*[@class="quantity"][.="'+ numbers +'"]');
    }
    _lastProduct(index){
        return element.byXpath('(//td[@class="item"])['+ index +']');
    }
    _removeButton(product){
        return element.byName('remove_cart_item');
    }

    checkout(){
        return driver.get(this._checkout);
    }
    checkProductNumbers(numbers){
        return this._productNumbers(numbers)
            .then(_=> {return true})
            .catch(_=> {return false})
    }
    getLastProduct(index) {
        return this._lastProduct(index)
            .then(lastProduct=>{
                return {
                    checkRemoved() {
                        return driver.wait(until.stalenessOf(lastProduct), 4000)
                            .then(_=>{return true})
                            .catch(_=>{return false})
                    }}
            });
    }
    removeProduct() {
        this._removeButton().click();
    }
}

exports.MainPage = MainPage;
exports.Product = Product;
exports.Cart = Cart;