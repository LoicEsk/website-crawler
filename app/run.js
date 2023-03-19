import prompt from 'prompt';
import Scrapper from './modules/Scrapper.js';

//
// Start the prompt
//
prompt.start();

( async() => {

    const toCrawl = process.argv.filter( (val ) => (
        val.match(/^(?:https?:\/\/)?((?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+))/i)
    ) );

    // const {url} = await prompt.get(['url']);

    if( toCrawl.length === 0 ) {
        console.log( 'Aucune URL reçu. Passez les en paramètres.');
        return;
    }

    console.log( "Crawl des URL :", toCrawl);
    
    // Initailisation du scrapper
    const scrapper = new Scrapper();

    // lancement de Puppeteer
    await scrapper.start();

    const urlList = await scrapper.deepScrap( toCrawl );

    console.log( '' );
    console.log( '%d pages trouvées.', urlList.length );
    // console.log( urlList );

    await scrapper.ends();
})();