# Export integrali per Eldar

Controllo del 6 ottobre 2026: tutti i 15 MP4 disponibili in GitHub Pages e nelle
copie locali del sito durano 15 secondi. Il commit che li introduce è
`57ea1c1150b9bdf56959d82fb2061d27c2d20a33` e dichiara esplicitamente gli estratti.
Gli export integrali non sono stati trovati nelle copie accessibili.

Le schede della seconda galleria e il lettore aperto usano entrambi
`/films/<nome>.mp4`, senza limite di riproduzione. Finché il file è un estratto,
l'etichetta «Extracto» viene mostrata anche prima del caricamento dei metadati,
grazie al flag `excerpt: true` nel catalogo `src/films.ts`. La durata effettiva
si legge dai metadati. Dopo avere sostituito e verificato un export integrale,
rimuovere il flag `excerpt: true` dalla voce corrispondente e ricostruire il sito.
Il confronto con la durata prevista resta una verifica aggiuntiva: non rimuovere
il flag prima di avere controllato il file completo.

| File da consegnare | Durata prevista circa | Formato |
| --- | ---: | --- |
| villa-alfa-tour.mp4 | 3:00 | 16:9 |
| cin-lento.mp4 | 0:58 | 9:16 |
| villa-alfa-agent.mp4 | 0:49 | 9:16 |
| villa-hd.mp4 | 0:54 | 16:9 |
| villa-alfa-detail.mp4 | 0:38 | 9:16 |
| villa-alfa-short.mp4 | 0:29 | 9:16 |
| fpv-villa.mp4 | 1:17 | 16:9 |
| ultimo-llamada.mp4 | 0:56 | 9:16 |
| ignazio.mp4 | 0:20 | 9:16 |
| madronal.mp4 | 0:44 | 9:16 |
| project-3.mp4 | 0:47 | 16:9 |
| mr-eh.mp4 | 1:30 | 16:9 |
| toro-negro.mp4 | 0:31 | 9:16 |
| puerto-banus.mp4 | 0:34 | 9:16 |
| zaceni-balam.mp4 | 0:35 | 9:16 |

Esportare MP4 H.264, audio AAC e fast start; 720×1280 per i verticali,
1920×1080 per gli orizzontali. Conservare tutta la durata, senza taglio a 15
secondi. Usare export web compressi, senza caricare gli originali della camera.

Per aggiornare il sito pubblicato, sostituire i file in
`domains/stoari.com/public_html/films/` mantenendo questi nomi. Svuotare la cache
del sito/CDN dopo la sostituzione e verificare la durata nel lettore pubblico.
Per un nuovo build, aggiornare anche `public/films/` e il publicDir del runtime
locale, quindi eseguire `node scripts/check-film-durations.mjs public/films`.
Il bundle normale verifica le durate prima della pubblicazione; l'opzione
`--preview-excerpts` serve solo per mantenere esplicitamente gli estratti attuali.

Un backup di Final Cut cita il progetto originale Villa Alfa sul disco T7:
`/Volumes/T7/CLIENTES/ELDAR/VILLA ALFA/VILLA ALFA.fcpbundle/`.
Il disco non era collegato durante questo controllo; il backup contiene
metadati del progetto, non gli export integrali.
