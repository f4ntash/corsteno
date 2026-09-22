# Integraciones municipales

Las experiencias municipales se sirven como módulos estáticos dentro del mismo deploy de Corsteno:

```txt
/:municipality/
/:municipality/dashboard/
```

El motor y el contenido municipal permanecen separados del sitio corporativo. Cada demo se construye con el prefijo de assets de su ruta y se publica dentro de `public/<municipality>/`. Para soportar refresh directo en el dashboard, el build debe incluir también `public/<municipality>/dashboard/index.html`.

## Pasaporte Bialet

La fuente modular vive en el proyecto municipal y conserva su paquete `municipalities/bialet-masse/`. Para regenerar el módulo integrado:

```powershell
cd C:\ruta\al\proyecto\municipal
$env:VITE_BASE_PATH = '/bialet/'
npm run build
```

Copiar el contenido de `dist/` a `public/bialet/` y duplicar `index.html` en `public/bialet/dashboard/index.html`. El módulo incluye `noindex, nofollow` y no se agrega al sitemap corporativo.

El progreso de cada municipio queda namespaced en browser storage con el formato:

```txt
corsteno:municipality:<slug>:passport
corsteno:municipality:<slug>:analytics
```

Para sumar otra experiencia, por ejemplo `/cosquin` o `/lafalda`, se repite el mismo contrato de build y publicación sin modificar el motor del sitio principal ni agregar rutas al menú general.
