const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const expect = require('chai').expect;

test.describe('Country zones', function() {
    let driver;
    const adminPage = 'http://10.0.9.48/litecart/admin/'; //!!!CHANGE TO LOCALHOST
    const countriesPage = adminPage + '?app=countries&doc=countries';
    const geoZonePage = adminPage + '?app=geo_zones&doc=geo_zones';
    const adminLogin = 'admin';
    const adminPass = 'admin';

    test.before(function *() {
        driver = yield new Builder()
            .forBrowser('chrome')
            .build();
        driver.get(adminPage);
        driver.findElement(By.name('username')).sendKeys(adminLogin);
        driver.findElement(By.name('password')).sendKeys(adminPass);
        driver.findElement(By.name('login')).click();
    });

    test.it('Check country sorting', function*() {
        function getSubZones() {
            return driver.findElements(By.xpath('//*[@class="row"]/td[6][.!="0"]/following-sibling::td/a'))
                .then(links =>{
                    return Promise.all(links.map(link => {return link.getAttribute('href')}))
                });
        }

        function getCountriesNames(){
            return driver.findElements(By.css('.row td:nth-child(5)'))
                .then(elements => {return Promise.all(elements.map(el => {return el.getText()}))})
        }
        
        function getZonesNames() {
            return driver.findElements(By.css('.dataTable tr td:nth-child(3)'))
                .then(elements => {return Promise.all(elements.map(el => {return el.getText()}))})
        }

        driver.get(countriesPage);
        let linksToSubZones = yield getSubZones();
        getCountriesNames()
            .then(countriesArray =>{
                let unsortedCountries = Array.from(countriesArray);
                let sortedCountries = Array.from(countriesArray.sort());
                expect(unsortedCountries).deep.equal(sortedCountries, 'Неправильная сортировка по странам');
            });

        linksToSubZones.forEach(zone => {
            driver.get(zone);
            getZonesNames()
                .then(zoneNames => {
                    zoneNames.pop();
                    let unsortedZones = Array.from(zoneNames);
                    let sortedZones = Array.from(zoneNames.sort());
                    expect(unsortedZones).deep.equal(sortedZones, 'Неправильная сортировка зон внутри страны');
                });
        });
    });

    test.it('Check geo zones sorting', function *() {
        function getCountriesLinks() {
            return driver.findElements(By.css('.row td:nth-child(3) a'))
                .then(elements =>{
                    return Promise.all(elements.map(element => {return element.getAttribute('href')}))
                });
        }

        function getZonesNames() {
            return driver.findElements(By.css('#table-zones tr td:nth-child(3) [selected]'))
                .then(elements => {
                    return Promise.all(elements.map(el => {return el.getText()}))})
        }
        
        driver.get(geoZonePage);
        let countriesToCheck = yield getCountriesLinks();
        countriesToCheck.forEach(zonePage=> {
            driver.get(zonePage);
            getZonesNames()
                .then(zoneNames=>{
                    let unsortedZones = Array.from(zoneNames);
                    let sortedZones = Array.from(zoneNames.sort());
                    expect(unsortedZones).deep.equal(sortedZones, 'Неправильная сортировка геозон внутри страны');
                });
        })
    });

    test.after(() => driver.quit());
});
