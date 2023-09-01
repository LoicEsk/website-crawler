import Puppeteer from 'puppeteer';
import _ from 'lodash';

export class Scrapper {

    constructor()
    {
        this.reporting = [];
    }

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

    getReporting()
    {
        return this.reporting;
    }

    async deepScrap( urls, domainLock = true ) {
        let urlsDone = [];
        let urlsToScrap = [...urls];

        while( urlsToScrap.length !== 0 ) {
            
            // scrap des pages
            while( urlsToScrap.length !== 0 ) {
                const url = urlsToScrap.shift();

                const scrapRetun = await this.scrap( url );

                urlsDone.push( url );

                const {internal_links} = scrapRetun;

                const newUrls = _.difference( internal_links, urlsDone );
                urlsToScrap = _.union(urlsToScrap, newUrls );

            }

            // console.log( 'to scrap : ', urlsToScrap );
        }
        process.stdout.write( '\n' );

        return urlsDone;
    }

    async scrap( url ) {

        process.stdout.write( '- ' + url + '  ' );

        // domaine
        const urlMatch = url.match(/^(?:https?:\/\/)?((?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+))/i);
        const scheme = urlMatch[1];
        const domain = urlMatch[2];
        
        // chargement de la page
        const page = await this.browser.newPage();
        let statusCode = 0;
        try{
            const response = await page.goto( url );
            statusCode = response.status();
            await page.waitForSelector('body'); // indicateur de chargement
        } catch( err ) {
            // console.warn( 'Echec de chargement de %s', url );
            process.stdout.write( 'X(' );
            return [];
        }

        process.stdout.write(':)');

        // liste de tous les liens
        let allHrefs = await page.evaluate(() =>
            [...document.querySelectorAll( 'a' )].map(link => link.href)
        );

        // réslution des URL relatives
        allHrefs = allHrefs.map( a => {
            try {
                const u = new URL( a, url );
                return u.href.split('#')[0]; // on ne garde pas les ancres
            } catch( err ) {
                return a;
            }
        } );

        const internalLinks = allHrefs.filter( (a) => {
            const uM = a.match(/^(?:https?:\/\/)?((?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+))/i);
            const d = uM[2];
            return domain === d;
        });

        const externalLinks = allHrefs.filter( a => {
            return !internalLinks.includes( a );
        });


        await page.close();

        const rapport = {
            url:              url,
            statusCode:       statusCode,
            internal_links:   internalLinks,
            external_links:   externalLinks
        };

        console.log( '' );

        this.reporting.push( rapport );
        return rapport;
    }

};

export default Scrapper;