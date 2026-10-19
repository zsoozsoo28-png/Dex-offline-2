DEX + WORK · HELYI, OFFLINE PRÓBA

TELEPÍTÉS A GITHUB PAGES-RE TELEFONRÓL
1. Töltsd le és csomagold ki ezt a ZIP-et a telefon Saját fájlok alkalmazásával.
2. Chrome-ban nyisd meg a GitHub-tárhelyedet, majd Code → Add file → Upload files.
3. A kibontott csomag TELJES TARTALMÁT töltsd fel a tárhely gyökerébe, a work mappával együtt. Ha a telefon mappa-feltöltést nem ajánl fel, a gyökérfájlokat és a work mappán belüli fájlokat külön töltsd fel a megfelelő helyre.
4. Nyomd meg a Commit changes gombot. GitHub Pages frissülése után nyisd meg a Pages címet Chrome-ban.
5. Először online nyisd meg egyszer a DEX-et, majd egyszer a /work/ oldalt. Hagyd betölteni őket; az új service worker letölti a WORK fájljait az offline próbához.
6. Telepítsd a DEX-et a Chrome menü → Hozzáadás a kezdőképernyőhöz paranccsal.
7. Próbáld ki külön Chrome-fülön, majd kapcsold be a repülő módot és frissítsd az oldalakat.

HASZNÁLAT
- DEX VR indítása: „VR mód”. A kameraengedélyt engedélyezni kell.
- WORK megjelenítése VR-ben: „Tedd elém a WORK-öt” vagy „Mutasd a WORK-öt”.
- WORK elrejtése: „WORK el”.
- A DEX és a WORK legyen ugyanazon GitHub Pages-cím alatt. A DEX küldhet parancsot a külön Chrome-fülön megnyitott WORK-nek is.
- Helyi parancsok: „keresd meg a …”, „nyisd meg a …”, „írd át [régi felirat] erre [új felirat]”, „színezd át [felirat] kékre/lilára/rózsaszínre/fehérre/zöldre”, „vond vissza a módosításokat”.
- A „keresd meg” parancs a WORK saját keresőmezőjét tölti ki, ha talál ilyet. A DEX által végzett szöveg- és színváltoztatások a telefon böngészőjében tárolódnak, és a „vond vissza a módosításokat” paranccsal törölhetők.

FONTOS KORLÁTOK
- Ez az offline próba nem írja át a WORK programfájljait, és nem ment szerverre, termékadatbázisba vagy másik készülékre. Csak a látható oldal támogatott elemeinek helyi megjelenését módosítja.
- A mostani WORK demóban nincs „vásárlások” adminoldal vagy valódi vásárlási adatbázis. Ha nincs ilyen menü/kereső az oldalon, a DEX ezt jelzi; nem talál ki vagy módosít nem létező adatot.
- Nincs a csomagban teljes helyi nyelvi modell. A DEX itt meghatározott magyar hangparancsokat értelmez. Az Android/Chrome beszédfelismerése internettől és a telefon helyi nyelvi csomagjától függhet; a teljes offline beszédfelismerés ezen a telefonon még nincs igazolva.
- A GitHub Pages első megnyitása internetet igényel. Az offline mód csak az egyszer már letöltött fájlokkal próbálható. A kamera HTTPS-en használható, a Chrome/Android mikrofonengedélyt is kér.
- VR-próbát ülve vagy álló helyben, biztonságos beltéri környezetben végezz. A kamerakép késhet és takarhatja a közvetlen látást; ne sétálj a szemüvegben.
