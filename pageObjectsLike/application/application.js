const {MainPage, Product, Cart} = require('../appPages/appPages');

class Application{
    constructor(homePage){
        this.mainPage = new MainPage(homePage);
        this.cart = new Cart(homePage);
        this.product= new Product();
    }
    addProductToCart(product, index){
        let xpathIndex = ++index;
        this.mainPage.go();
        this.mainPage.openProduct(product);
        this.product.addToCart();
        if (xpathIndex) return this.cart.checkProductNumbers(xpathIndex);
    }
    removeProductFromCart(lastProduct){
        this.cart.checkout();
        return this.cart.getLastProduct(lastProduct)
            .then(lastProduct=>{
                this.cart.removeProduct();
                return lastProduct.checkRemoved();
            });
    }
}

module.exports = Application;