const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const expect = require('chai').expect;

test.describe('New product', function() {
    let driver;
    const homePage = 'http://10.0.9.104/litecart/'; //!!!CHANGE TO LOCALHOST
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

    test.it('Check new product adding', function*() {
        const catalogPage = homePage + 'admin/?app=catalog&doc=catalog';
        const testImage = __dirname + '\\IMG.jpg'; //!!!Need IMG file in current directory
        const productName = makeName();

        function makeName() {
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( let i=0; i < 5; i++ ){
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        function _getByName(name) {
            return driver.findElement(By.name(name))
        }

        function _getByCss(name) {
            return driver.findElement(By.css(name))
        }

        function _getByXpath(name) {
            return driver.findElement(By.xpath(name))
        }
        
        function getProducts() {
            return _getByCss('.dataTable').getText();
        }

        let newProduct = {
            add() {
                driver.get(catalogPage);
                driver.findElement(By.css('#content div a:last-child')).click();
            },
            save(){
                return _getByName('save').click();
            },
            general:{
                open(){
                    _getByCss('.index li:nth-child(1)').click();
                },
                setStatus(enabled){
                    if (enabled) return _getByCss('[name="status"][value="1"]').click();
                    return _getByCss('[name="status"][value="0"]').click();
                },
                setName(name){
                    _getByName('name[en]').sendKeys(name);
                },
                setCode(code){
                    _getByName('code').sendKeys(code);
                },
                setCategories(...categories){
                    categories.forEach(category=>{ _getByCss('[data-name="'+ category +'"]').click() });
                },
                setGenders(...genders){
                    if (genders.includes('Male')) _getByCss('[name="product_groups[]"][value="1-1"]').click();
                    if (genders.includes('Female')) _getByCss('[name="product_groups[]"][value="1-2"]').click();
                    if (genders.includes('Unisex')) _getByCss('[name="product_groups[]"][value="1-3"]').click();
                },
                setQuantity(quantity){
                    _getByName('quantity').clear();
                    _getByName('quantity').sendKeys(quantity);
                },
                setImage(pathToImage){
                    _getByName('new_images[]').sendKeys(pathToImage)
                },
                setValidDate(from, to){
                    if (from){
                        _getByName('date_valid_from').sendKeys(from);
                    }
                    if (to){
                        _getByName('date_valid_to').sendKeys(to);
                    }
                }
            },
            information:{
                open(){
                    _getByCss('.index li:nth-child(2)').click();
                },
                setManufacturer(manufacturer){
                    _getByXpath('//*[@name="manufacturer_id"]/*[.="' + manufacturer + '"]').click();
                },
                setKeyWords(keywords){
                    _getByName('keywords').sendKeys(keywords)
                },
                setShortDescription(description){
                    _getByName('short_description[en]').sendKeys(description);
                },
                setDescription(description){
                    _getByCss('.trumbowyg-editor').sendKeys(description);
                },
                setHeadTitle(title){
                    _getByName('head_title[en]').sendKeys(title);
                },
                setMetaDescription(metaDescription){
                    _getByName('meta_description[en]').sendKeys(metaDescription);
                }
            },
            prices: {
                open(){
                    _getByCss('.index li:nth-child(4)').click();
                },
                setPurchasePrice(price, currency){
                    if(price){
                        _getByName('purchase_price').clear();
                        return _getByName('purchase_price').sendKeys(price);
                    }

                    if (currency){
                        return  _getByCss('[name="purchase_price_currency_code"] [value="'+ currency +'"]').click();
                    }

                },
                setPrice(usd, eur){
                    if (usd) _getByName('prices[USD]').sendKeys(usd);
                    if (eur) _getByName('prices[EUR]').sendKeys(eur);
                }
            }
        };

        newProduct.add();

        newProduct.general.setStatus(true);
        newProduct.general.setName(productName);
        newProduct.general.setCode('123');
        newProduct.general.setCategories('Rubber Ducks', 'Subcategory');
        newProduct.general.setGenders('Female', 'Male');
        newProduct.general.setQuantity('333');
        newProduct.general.setImage(testImage);
        newProduct.general.setValidDate('12.12.2016', '12.12.2018');

        newProduct.information.open();
        newProduct.information.setManufacturer('ACME Corp.');
        newProduct.information.setKeyWords('ACME Corp.');
        newProduct.information.setShortDescription('ACME Corp. and bla bla bla');
        newProduct.information.setDescription('ACME Corp. and bla bla bla and bla');
        newProduct.information.setHeadTitle('Product title');
        newProduct.information.setMetaDescription('Meta bla bla bla');

        newProduct.prices.open();
        newProduct.prices.setPurchasePrice('42');
        newProduct.prices.setPurchasePrice('12', 'EUR');
        newProduct.prices.setPrice('12', '36');

        newProduct.save();

        expect(yield getProducts()).to.contains(productName);
    });

    test.after(() => driver.quit());
});
