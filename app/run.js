import prompt from 'prompt';
import Scrapper from './modules/Scrapper.js';

//
// Start the prompt
//
prompt.start();

( async() => {

    const {url} = await prompt.get(['url']);

    console.log( "Crawl de %s", url);
    
    // Initailisation du scrapper
    const scrapper = new Scrapper();

    // lancement de Puppeteer
    await scrapper.start();

    const urlList = await scrapper.scrap( url, url );

    console.log( 'Pages trouvées :' );
    console.log( urlList );

    await scrapper.ends();
})();