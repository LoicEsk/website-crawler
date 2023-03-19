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

    async scrap( url, domainLock = true ) {

        // domaine
        const urlMatch = url.match(/^(?:https?:\/\/)?((?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+))/i);
        const scheme = urlMatch[1];
        const domain = urlMatch[2];
        
        // chargement de la page
        const page = await this.browser.newPage();
        await page.goto( url );
        await page.waitForSelector('body'); // indicateur de chargement

        process.stdout.write('.');

        // liste de tous les liens
        let allHrefs = await page.evaluate(() =>
            [...document.querySelectorAll( 'a' )].map(link => link.href)
        );

        // réslution des URL relatives
        allHrefs = allHrefs.map( a => {
            const u = new URL( a, url );
            return u.href;
        } );

        if( domainLock && !!domain ) {
            allHrefs = allHrefs.filter( (a) => {
                const uM = a.match(/^(?:https?:\/\/)?((?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+))/i);
                const d = uM[2];
                return domain === d;
            })
        }

        await page.close();
        return allHrefs;
    }

};

export default Scrapper;