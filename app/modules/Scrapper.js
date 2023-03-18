import Puppeteer from 'puppeteer';

export class Scrapper {

    async start() {
        this.browser = await Puppeteer.launch({
            headless: true, 
            executablePath: '/usr/bin/google-chrome',
            args: [
                '--shm-size=3gb', 
                '--no-sandbox'
            ] 
        });
    }

    async ends() {
        await this.browser.close();
    }

    async scrap( url, parentLock ) {

        // chargement de la page
        const page = await this.browser.newPage();
        await page.goto( url );
        await page.waitForSelector('body'); // indicateur de chargement

        const selector = !parentLock ? 'a' : `a[href^="${parentLock}"], a[href^="/"]`;
        const allHrefs = await page.evaluate(() =>
            [...document.querySelectorAll( 'a' )].map(link => link.href)
        );

        await page.close();
        return allHrefs;
    }

};

export default Scrapper;