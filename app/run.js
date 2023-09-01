import prompt from 'prompt';
import Scrapper from './modules/Scrapper.js';

import fs from 'fs';

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

    // Ecritur du rapport d'analyse
    try{
        fs.writeFileSync( './reporting/export.json', JSON.stringify( scrapper.getReporting() ), { flag: 'w+' } );
    } catch (err) {
        console.error(err);
    }

    
    console.log( '' );
    console.log( '%d pages analysée(s).', urlList.length );
    // console.log( urlList );

    await scrapper.ends();
})();