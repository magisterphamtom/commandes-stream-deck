# Commandes Stream Deck

Module Foundry VTT (v13 à v14.368) de magisterphamtom pour « Par-delà les Montagnes Hallucinées ».
Chaque bouton du Stream Deck envoie un raccourci clavier (F13 à F24, seul ou avec Maj, Ctrl ou Alt). Foundry le reçoit et lance la macro « SD NN » correspondante. Gratuit, aucun plugin Stream Deck à installer : on utilise l'action **Raccourci clavier (Hotkey)** fournie avec le logiciel Elgato.

## Installation dans Foundry
1. Activer le module « Commandes Stream Deck », puis F5.
2. Au premier chargement, accepter « Créer les 44 macros ». Elles arrivent dans le dossier de macros **Stream Deck** (SD 01 à SD 44), avec leur icône.
   Pour les recréer plus tard : Paramètres > Configurer les paramètres > Commandes Stream Deck > cocher « Réinstaller les macros » > Enregistrer.
3. Pré-requis : avoir lancé « Installer les playlists » et « Installer les bruitages » (sinon un bouton affiche « introuvable »).

Les raccourcis sont réservés au Gardien et modifiables dans Configurer les contrôles > Commandes Stream Deck.
**La fenêtre Foundry doit avoir le focus** (cliquer dedans une fois) pour recevoir les touches. Si vous êtes dans OBS ou un autre logiciel, les touches partent là-bas.

## Réglage d'un bouton dans le logiciel Stream Deck
1. Glisser l'action **Système > Raccourci clavier** (Hotkey) sur une touche.
2. Dans le champ du raccourci, choisir la touche dans la liste déroulante (F13 à F24 sont dans les touches spéciales) et cocher Maj / Ctrl / Alt si besoin (voir le tableau).
3. Icône : clic sur l'image du bouton > « Choisir une image » > `Data/modules/commandes-stream-deck/icons/SDNN.png`.
4. Titre : laisser vide (le nom est déjà dans l'image).

## Pour modifier ce que fait un bouton
Ouvrir la macro « SD NN · … » et changer sa ligne, par exemple :
```js
const api = game.modules.get("commandes-stream-deck").api;
api.music("3 · Antarctique", "Into the White · …");   // un morceau (2e appui = arrêt), coupe les autres musiques
api.music("3 · Antarctique");                          // toute la playlist
api.sfx("01 Hôtel Amherst", "Sonnette de la réception"); // un bruitage par-dessus (une boucle « Fond » s'arrête au 2e appui)
api.stop("all");  api.stop("music");  api.stop("environment");
api.next();                                            // morceau suivant
api.volume("music", 0.1);  api.volume("environment", -0.1); // volume des sons en cours, pour toute la table
api.tool("basculeEpoque");                             // ouvre un outil de la barre de gauche
```
Les boutons 45 à 48 (Alt+F21 à Alt+F24) sont libres : créez une macro nommée « SD 45 · ce que vous voulez ».

## Disposition conseillée

**Stream Deck XL (32 touches, 4 rangées de 8)**
- Rangée 1 : boutons 1 à 8 (ambiances New York).
- Rangée 2 : boutons 9 à 16 (playlists par livre).
- Rangée 3 : boutons 17 à 24 (bruitages).
- Rangée 4 : boutons 25 à 31 (bruitages) + 32 STOP TOUT en bas à droite.
Faire un **dossier** ou une 2e page pour 33 à 44 si vous voulez tout sur le XL.

**Stream Deck + (8 touches, 4 molettes)**
- Touches : 32 STOP TOUT, 33 Stop musique, 34 Stop bruitages, 35 Morceau suivant, 36 Bascule d'époque, 37 Aide de jeu, 38 Conversation, 39 Combat.
- Molette 1 = volume musique : rotation gauche → Alt+F17 (bouton 41), rotation droite → Alt+F18 (bouton 42), appui → Ctrl+F21 (33, stop musique).
- Molette 2 = volume bruitages : gauche → Alt+F19 (43), droite → Alt+F20 (44), appui → Ctrl+F22 (34, stop bruitages).
- Molettes 3-4 : libres (40 Orage, 31 Coup de feu…).
Pour les molettes, utiliser l'action de molette qui accepte un raccourci par rotation (selon la version du logiciel Elgato : « Raccourci clavier » posé sur la molette, ou le plugin gratuit « Hotkey Dial » / « Dial Hotkeys » du Marketplace). Chaque cran de molette = ±10 % de volume.

## Tableau des boutons
| N° | Bouton | Raccourci | Icône |
|---|---|---|---|
| 1 | Rues de New York | F13 | `icons/SD01.png` |
| 2 | Hôtel Amherst | F14 | `icons/SD02.png` |
| 3 | Speakeasy | F15 | `icons/SD03.png` |
| 4 | Port de New York | F16 | `icons/SD04.png` |
| 5 | Commissariat | F17 | `icons/SD05.png` |
| 6 | Enquête noire | F18 | `icons/SD06.png` |
| 7 | Bibliothèque | F19 | `icons/SD07.png` |
| 8 | Inquiétude | F20 | `icons/SD08.png` |
| 9 | Générique | F21 | `icons/SD09.png` |
| 10 | New York 1933 | F22 | `icons/SD10.png` |
| 11 | La traversée | F23 | `icons/SD11.png` |
| 12 | Antarctique | F24 | `icons/SD12.png` |
| 13 | La Cité | Maj+F13 | `icons/SD13.png` |
| 14 | L'Abîme | Maj+F14 | `icons/SD14.png` |
| 15 | 2025-2026 | Maj+F15 | `icons/SD15.png` |
| 16 | Moments forts | Maj+F16 | `icons/SD16.png` |
| 17 | Sonnette | Maj+F17 | `icons/SD17.png` |
| 18 | Téléphone | Maj+F18 | `icons/SD18.png` |
| 19 | Flash photo | Maj+F19 | `icons/SD19.png` |
| 20 | Corne de brume | Maj+F20 | `icons/SD20.png` |
| 21 | Klaxon bateau | Maj+F21 | `icons/SD21.png` |
| 22 | Glas | Maj+F22 | `icons/SD22.png` |
| 23 | Corbeaux | Maj+F23 | `icons/SD23.png` |
| 24 | Morse | Maj+F24 | `icons/SD24.png` |
| 25 | Tonnerre | Ctrl+F13 | `icons/SD25.png` |
| 26 | Révélation | Ctrl+F14 | `icons/SD26.png` |
| 27 | Cœur qui bat | Ctrl+F15 | `icons/SD27.png` |
| 28 | Porte qui grince | Ctrl+F16 | `icons/SD28.png` |
| 29 | Verre brisé | Ctrl+F17 | `icons/SD29.png` |
| 30 | Voiture 1929 | Ctrl+F18 | `icons/SD30.png` |
| 31 | Coup de feu | Ctrl+F19 | `icons/SD31.png` |
| 32 | STOP TOUT | Ctrl+F20 | `icons/SD32.png` |
| 33 | Stop musique | Ctrl+F21 | `icons/SD33.png` |
| 34 | Stop bruitages | Ctrl+F22 | `icons/SD34.png` |
| 35 | Morceau suivant | Ctrl+F23 | `icons/SD35.png` |
| 36 | Bascule d'époque | Ctrl+F24 | `icons/SD36.png` |
| 37 | Aide de jeu | Alt+F13 | `icons/SD37.png` |
| 38 | Conversation | Alt+F14 | `icons/SD38.png` |
| 39 | Combat | Alt+F15 | `icons/SD39.png` |
| 40 | Orage (fond) | Alt+F16 | `icons/SD40.png` |
| 41 | Musique − | Alt+F17 | `icons/SD41.png` |
| 42 | Musique + | Alt+F18 | `icons/SD42.png` |
| 43 | Bruitages − | Alt+F19 | `icons/SD43.png` |
| 44 | Bruitages + | Alt+F20 | `icons/SD44.png` |
| 45-48 | libres | Alt+F21 à Alt+F24 | — |
