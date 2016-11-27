const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const expect = require('chai').expect;

test.describe('Yellow Duck', function() {
    let driver;
    const homePage = 'http://10.0.9.48/litecart'; //!!!CHANGE TO LOCALHOST

    test.before(function *() {
        driver = yield new Builder()
            .forBrowser('chrome')
            .build();
    });

    test.it('Check duck', function*() {
        function getHomePage() {
            return driver.get(homePage);
        }
        function openCampaigningDuck() {
            return driver.findElement(By.css('#box-campaigns .product')).click();
        }

        function getTitleText() {
            return driver.findElement(By.css('#box-product .title')).getText();
        }

        function getRegularPrice() {
            return driver.findElement(By.css('.regular-price')).getText();
        }

        function getCampaignPrice() {
            return driver.findElement(By.css('.campaign-price')).getText();
        }

        class PriceStyles {
            constructor(locator){
                this._elemntLocator = locator;
            }
            _getElement(){
                return driver.findElement(By.css(this._elemntLocator))
            }
            getDecoration(){
                return this._getElement().getCssValue('text-decoration')
            }
            getColor(){
                return this._getElement().getCssValue('color')
            }
            getFontSize(){
                return this._getElement().getCssValue('font-size')
            }
            getFontWeight(){
                return this._getElement().getCssValue('font-weight')
            }
        }

        let campaignsYellowDuck = {
            regularPrice: new PriceStyles('#box-campaigns .regular-price'),
            campaignPrice: new PriceStyles('#box-campaigns .campaign-price')
        };

        let productYellowDuck = {
            regularPrice: new PriceStyles('.regular-price'),
            campaignPrice: new PriceStyles('.campaign-price')
        };

        getHomePage();

        campaignsYellowDuck.regularPrice.getDecoration()
            .then(decoration=>expect(decoration).to.equal('line-through', 'Неверные стили для цен'));

        campaignsYellowDuck.campaignPrice.getDecoration()
            .then(decoration=>expect(decoration).not.to.equal('line-through', 'Неверные стили для цен'));

        campaignsYellowDuck.regularPrice.getColor()
            .then(color=>expect(color).to.equal('rgba(119, 119, 119, 1)', 'Неверные стили для цен'));

        campaignsYellowDuck.campaignPrice.getColor()
            .then(color=>expect(color).to.equal('rgba(204, 0, 0, 1)', 'Неверные стили для цен'));

        campaignsYellowDuck.regularPrice.getFontSize()
            .then(fontSize=>expect(fontSize).to.equal('14.4px', 'Неверные стили для цен'));

        campaignsYellowDuck.campaignPrice.getFontSize()
            .then(fontSize=>expect(fontSize).to.equal('18px', 'Неверные стили для цен'));

        campaignsYellowDuck.regularPrice.getFontWeight()
            .then(fontWeight=>expect(fontWeight).to.equal('normal', 'Неверные стили для цен'));

        campaignsYellowDuck.campaignPrice.getFontWeight()
            .then(fontWeight=>expect(fontWeight).to.equal('bold', 'Неверные стили для цен'));

        openCampaigningDuck();

        getTitleText()
            .then(text=>expect(text).to.equal('Yellow Duck', 'Заголовок не соответствует товару'));
        getRegularPrice()
            .then(text=>expect(text).to.equal('$20', 'Постоянная цена не соответствует товару'));
        getCampaignPrice()
            .then(text=>expect(text).to.equal('$18', 'Предлагаемая цена не соответствует товару'));

        productYellowDuck.regularPrice.getDecoration()
            .then(decoration=>expect(decoration).to.equal('line-through', 'Неверные стили для цен'));

        productYellowDuck.campaignPrice.getDecoration()
            .then(decoration=>expect(decoration).not.to.equal('line-through', 'Неверные стили для цен'));

        productYellowDuck.regularPrice.getColor()
            .then(color=>expect(color).to.equal('rgba(102, 102, 102, 1)', 'Неверные стили для цен'));

        productYellowDuck.campaignPrice.getColor()
            .then(color=>expect(color).to.equal('rgba(204, 0, 0, 1)', 'Неверные стили для цен'));

        productYellowDuck.regularPrice.getFontSize()
            .then(fontSize=>expect(fontSize).to.equal('16px', 'Неверные стили для цен'));

        productYellowDuck.campaignPrice.getFontSize()
            .then(fontSize=>expect(fontSize).to.equal('22px', 'Неверные стили для цен'));

        productYellowDuck.regularPrice.getFontWeight()
            .then(fontWeight=>expect(fontWeight).to.equal('normal', 'Неверные стили для цен'));

        productYellowDuck.campaignPrice.getFontWeight()
            .then(fontWeight=>expect(fontWeight).to.equal('bold', 'Неверные стили для цен'));

    });

    test.after(() => driver.quit());
});
