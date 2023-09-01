# crawler

à la fin, ça va créer trois fichiers :

+ pagesCrawled.txt (toutes les pages crawlées du site)
+ classPasUsed.txt (classes pas utilisées)
+ classUsed.txt (classes utilisées)

## Todo :
Il faudra que je trouve un système pour choper le "domain" du site et qu'il tej tous les liens "sortant" : actuellement j'ai plein de conditions qui check sur dans l'url 
il n'y a pas facebook, twitter ou linkedin par ex, mais ça va devenir long à la longue.

## Pour lancer le script : 

1. Lancer le container Docker
``docker compose run bash``

2. Lancer le crawler
``npm run start <URL>``

Où <URL> est l'URL que l'on veut analyser.

Bien sûr, vu qu'il y a un package.json, pensez à le lancer auparavant pour générer les node_modules.

## v3 :

Pour lancer le script : node AioCrawler.js dans le dossier app

+ Utilisation de prompt-sync pour gérer les prompt en console.
+ Via la console, le script demande l'url du site à crawler, puis le type de crawl à effectuer (pages, css, images ou les trois).
+ Si une liste de pages existe, il est demandé à l'utilisateur s'il souhaite l'utiliser ou faire un nouveau crawl des pages.
+ Le script créé un dossier au nom de l'url du site et y stocke les fichiers (liste de classes, d'urls des pages et d'images).

## V4

1. Lancement du container : `docker compose run --rm crawler bash`
2. Lancement du Scrapper (dans le container) : `npm start votre_URL`

Ou 

`docker compose run --rm crawler npm start votre_URL`


