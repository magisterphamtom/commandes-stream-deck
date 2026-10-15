/**
 * Commandes Stream Deck — magisterphamtom — MIT
 * 48 raccourcis clavier (F13 à F24, seuls ou avec Maj / Ctrl / Alt) que le Stream Deck envoie à Foundry.
 * Le bouton n° NN lance la macro dont le nom commence par « SD NN » (dossier de macros « Stream Deck »).
 * Le module fournit aussi des fonctions pratiques pour ces macros : musique, bruitages, arrêts, volume.
 */
const ID = "commandes-stream-deck";
const SLOTS = 48;

function keyFor(i) {
  const M = foundry.helpers?.interaction?.KeyboardManager?.MODIFIER_KEYS ?? KeyboardManager.MODIFIER_KEYS;
  const f = (n) => `F${12 + n}`;
  if (i <= 12) return { key: f(i), modifiers: [] };
  if (i <= 24) return { key: f(i - 12), modifiers: [M.SHIFT] };
  if (i <= 36) return { key: f(i - 24), modifiers: [M.CONTROL] };
  return { key: f(i - 36), modifiers: [M.ALT] };
}

function keyLabel(i) {
  const k = `F${12 + (((i - 1) % 12) + 1)}`;
  return ["", "Maj+", "Ctrl+", "Alt+"][Math.floor((i - 1) / 12)] + k;
}

Hooks.once("init", () => {
  game.settings.register(ID, "installed", { scope: "world", config: false, type: Boolean, default: false });
  game.settings.register(ID, "reinstall", {
    name: "Réinstaller les macros du Stream Deck",
    hint: "Cochez puis enregistrez : recrée ou met à jour les 44 macros « SD NN » (dossier « Stream Deck »). Vos macros SD 45 à SD 48 ne sont pas touchées.",
    scope: "world", config: true, type: Boolean, default: false,
    onChange: async (v) => { if (!v || !game.user.isGM) return; await API.install(); await game.settings.set(ID, "reinstall", false); }
  });
  for (let i = 1; i <= SLOTS; i++) {
    const nn = String(i).padStart(2, "0");
    game.keybindings.register(ID, `bouton${nn}`, {
      name: `Stream Deck — bouton ${nn}`,
      hint: `Lance la macro « SD ${nn} · … » du dossier « Stream Deck ».`,
      editable: [keyFor(i)],
      restricted: true,
      precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
      onDown: () => { runSlot(nn); return true; }
    });
  }
});

Hooks.once("ready", async () => {
  const mod = game.modules.get(ID);
  if (mod) mod.api = API;
  if (!game.user.isGM) return;
  const done = game.settings.get(ID, "installed");
  if (done || game.macros.some((m) => m.name.startsWith("SD 01"))) return;
  const DialogV2 = foundry.applications.api.DialogV2;
  const ok = await DialogV2.confirm({
    window: { title: "Commandes Stream Deck" },
    content: "<p>Créer les 44 macros « SD 01 » à « SD 44 » (dossier <b>Stream Deck</b>) qui pilotent la musique et les bruitages ?</p><p>Vous pourrez relancer l'installation plus tard depuis Paramètres &gt; Commandes Stream Deck.</p>"
  });
  await game.settings.set(ID, "installed", true);
  if (ok) await API.install();
});

function runSlot(nn) {
  const macro = game.macros.find((m) => m.name === `SD ${nn}` || m.name.startsWith(`SD ${nn} `));
  if (!macro) return ui.notifications.warn(`Stream Deck : aucune macro « SD ${nn} ».`);
  macro.execute();
}

/* ------------------------------------------------------------------ */
/*  Fonctions pour les macros                                          */
/* ------------------------------------------------------------------ */

const channelOf = (p) => p?.channel ?? "music";
const findPlaylist = (name) => game.playlists.find((p) => p.name === name);
function findSound(playlistName, soundName) {
  const pl = findPlaylist(playlistName);
  if (!pl) { ui.notifications.warn(`Stream Deck : playlist « ${playlistName} » introuvable.`); return {}; }
  const sound = typeof soundName === "string"
    ? pl.sounds.find((s) => s.name === soundName)
    : pl.sounds.find((s) => soundName.test(s.name));
  if (!sound) ui.notifications.warn(`Stream Deck : « ${soundName} » introuvable dans « ${playlistName} ».`);
  return { pl, sound };
}

async function stopMusicExcept(keep) {
  for (const p of game.playlists) {
    if (p === keep || channelOf(p) !== "music") continue;
    if (p.playing || p.sounds.some((s) => s.playing)) await p.stopAll();
  }
}

const API = {
  /** Crée ou met à jour les macros « SD NN · … » à partir de layout.json. */
  async install() {
    if (!game.user.isGM) return ui.notifications.warn("Réservé au Gardien.");
    const layout = await (await fetch(`modules/${ID}/layout.json`)).json();
    const folder = game.folders.find((f) => f.type === "Macro" && f.name === "Stream Deck")
      ?? await Folder.create({ name: "Stream Deck", type: "Macro", color: "#c9a24a" });
    const q = (v) => JSON.stringify(v);
    const A = `game.modules.get("${ID}").api`;
    let created = 0, updated = 0;
    for (const [n, label, type, , args] of layout) {
      const nn = String(n).padStart(2, "0");
      let command;
      switch (type) {
        case "music": command = `${A}.music(${q(args[0])}, ${q(args[1])});`; break;
        case "playlist": command = `${A}.music(${q(args[0])});`; break;
        case "sfx": command = `${A}.sfx(${q(args[0])}, ${q(args[1])});`; break;
        case "sfxre": command = `${A}.sfx(${q(args[0])}, new RegExp(${q(args[1])}, "i"));`; break;
        case "stop": command = `${A}.stop(${q(args[0])});`; break;
        case "next": command = `${A}.next();`; break;
        case "tool": command = `${A}.tool(${q(args[0])});`; break;
        case "vol": command = `${A}.volume(${q(args[0])}, ${args[1]});`; break;
        default: continue;
      }
      const name = `SD ${nn} · ${label}`;
      const data = {
        name, type: "script", folder: folder.id, img: `modules/${ID}/icons/SD${nn}.png`,
        command: `// Stream Deck, bouton ${n} (${keyLabel(n)})\n${command}`
      };
      const existing = game.macros.find((m) => m.name.startsWith(`SD ${nn} `) || m.name === `SD ${nn}`);
      if (existing) { await existing.update(data); updated++; } else { await Macro.create(data); created++; }
    }
    ui.notifications.info(`Stream Deck : ${created} macro(s) créée(s), ${updated} mise(s) à jour (dossier « Stream Deck »).`);
  },

  /** Lance une musique : un morceau précis, ou toute la playlist si soundName est omis. Coupe les autres musiques. */
  async music(playlistName, soundName) {
    const pl = findPlaylist(playlistName);
    if (!pl) return ui.notifications.warn(`Stream Deck : playlist « ${playlistName} » introuvable.`);
    await stopMusicExcept(pl);
    if (!soundName) {
      if (pl.playing) await pl.stopAll();
      return pl.playAll();
    }
    const { sound } = findSound(playlistName, soundName);
    if (!sound) return;
    if (sound.playing) return pl.stopSound(sound); // second appui = arrêt
    if (pl.playing) await pl.stopAll();
    return pl.playSound(sound);
  },

  /** Joue un bruitage par-dessus la musique. Une boucle (« Fond ») s'arrête au second appui. */
  async sfx(playlistName, soundName) {
    const { pl, sound } = findSound(playlistName, soundName);
    if (!sound) return;
    if (sound.playing && sound.repeat) return pl.stopSound(sound);
    if (sound.playing) await pl.stopSound(sound);
    return pl.playSound(sound);
  },

  /** Arrête « music », « environment » ou « all ». */
  async stop(channel = "all") {
    for (const p of game.playlists) {
      if (channel !== "all" && channelOf(p) !== channel) continue;
      if (p.playing || p.sounds.some((s) => s.playing)) await p.stopAll();
    }
  },

  /** Passe au morceau suivant de la musique en cours. */
  async next() {
    const pl = game.playlists.find((p) => channelOf(p) === "music" && p.playing);
    if (!pl) return ui.notifications.info("Stream Deck : aucune musique en cours.");
    return pl.playNext();
  },

  /** Monte ou baisse le volume des sons en cours d'un canal, pour toute la table. */
  async volume(channel, delta) {
    const updates = new Map();
    for (const p of game.playlists) {
      if (channelOf(p) !== channel) continue;
      for (const s of p.sounds) {
        if (!s.playing) continue;
        const v = Math.min(1, Math.max(0, Math.round(((s.volume ?? 0.5) + delta) * 100) / 100));
        if (!updates.has(p)) updates.set(p, []);
        updates.get(p).push({ _id: s.id, volume: v });
      }
    }
    if (!updates.size) return ui.notifications.info(`Stream Deck : rien ne joue sur le canal ${channel === "music" ? "Musique" : "Environnement"}.`);
    for (const [p, u] of updates) await p.updateEmbeddedDocuments("PlaylistSound", u);
  },

  /** Ouvre un outil de la barre de gauche (Bascule d'époque, Conversation, Remettre une aide de jeu…). */
  tool(name) {
    const tool = ui.controls.controls?.tokens?.tools?.[name];
    if (!tool || tool.visible === false) return ui.notifications.warn(`Stream Deck : outil « ${name} » indisponible.`);
    tool.onChange?.(null, true);
  }
};
