const {browserName, implicitlyWait, windowMaximize} = require('./driverSettings');
const {Builder, By} = require('selenium-webdriver');

global.driver = new Builder()
    .forBrowser(browserName)
    .build();

if (implicitlyWait) driver.manage().timeouts().implicitlyWait(implicitlyWait);
if (windowMaximize) driver.manage().window().maximize();

global.element={
    byCss(css){
        return driver.findElement(By.css(css))
    },
    byXpath(xpath){
        return driver.findElement(By.xpath(xpath))
    },
    byName(name){
        return driver.findElement(By.name(name))
    }
};

global.elements={
    byCss(css){
        return driver.findElements(By.css(css))
    },
    byXpath(xpath){
        return driver.findElements(By.xpath(xpath))
    },
    byName(name){
        return driver.findElements(By.name(name))
    }
};
