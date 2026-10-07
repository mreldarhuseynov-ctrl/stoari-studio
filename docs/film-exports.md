# Vídeos completos recibidos — 6 de octubre de 2026

Los 15 MP4 completos se han descargado del borrador autenticado de GitHub
`films-full-2026-10-06` (release 405159956, asset 616717813), archivo
`stoari-films-full.zip`. La release sigue siendo un borrador.

El ZIP contiene exactamente los 15 MP4 en su raíz, con CRC válido. Se han
sustituido directamente en `public/films/`, conservando los pósteres `.webp`
y los `-preview.mp4`, y sincronizado el publicDir del runtime local.
`node scripts/check-film-durations.mjs public/films` verifica las 15 duraciones
con el catálogo. Se han retirado los 15 flags `excerpt: true` únicamente después
de verificar los archivos completos. El control de duración del reproductor
sigue activo por si se vuelve a cargar un extracto por error.

SHA-256 del ZIP original:
`0e818bb21d0870cc160b564f9e32f7714fe680620c077b83643f6fa684b5f021`

El paquete de Hostinger se genera con `npm run bundle:hostinger`, sin la opción
`--preview-excerpts`. Los MP4 continúan fuera de Git; el ZIP se conserva como
asset del borrador y los extractos anteriores tienen una copia local de seguridad.
La generación del paquete no publica la release ni despliega automáticamente.

## Publicación — 7 de octubre de 2026

Los 15 vídeos completos están publicados en `https://stoari.com/films/`.
Se han verificado las duraciones sobre las URL públicas y las 15 respuestas
HTTP 206 para reproducción y búsqueda por rangos. El lector de Villa Alfa
muestra 3:00. Las URL de reproducción incluyen `?v=full-20261006` para evitar
que visitantes anteriores reutilicen los extractos almacenados en caché.

Los 238 archivos publicados coinciden con el manifiesto SHA-256 del paquete.
HTML, JavaScript y CSS públicos coinciden con el build. La configuración SMTP
privada se conserva fuera de `public_html`. Copia de recuperación del sitio
anterior: `~/stoari-releases/20261007-full-films/before-site.tar.gz`.
La release de GitHub se conserva como borrador.

## Recuperación en un checkout nuevo

```bash
gh release download films-full-2026-10-06 --repo mreldarhuseynov-ctrl/stoari-studio --pattern stoari-films-full.zip
unzip -o stoari-films-full.zip -d public/films
npm run bundle:hostinger
```

Se necesita acceso autenticado al borrador. Los pósteres y las previsualizaciones
se recuperan del respaldo existente o de la rama `gh-pages`; sus MP4 principales
son extractos antiguos y deben sustituirse por los completos antes del build.

---

## Historial anterior a la entrega


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
