const headType = document.getElementById("headType");
const bodyType = document.getElementById("bodyType");
const elementSelect = document.getElementById("element");
const habitatSelect = document.getElementById("habitat");
const forgeButton = document.getElementById("forgeButton");
const randomButton = document.getElementById("randomButton");
const favoriteButton = document.getElementById("favoriteButton");
const creatureNameEl = document.getElementById("creatureName");
const rarityBadge = document.getElementById("rarityBadge");
const rarityText = document.getElementById("rarityText");
const powerLevel = document.getElementById("powerLevel");
const elementText = document.getElementById("elementText");
const habitatText = document.getElementById("habitatText");
const classText = document.getElementById("classText");
const creatureLore = document.getElementById("creatureLore");
const powerTier = document.getElementById("powerTier");
const bestiaryList = document.getElementById("bestiaryList");
const strongestCreature = document.getElementById("strongestCreature");
const rarestCreature = document.getElementById("rarestCreature");
const averagePower = document.getElementById("averagePower");
const currentYear = document.getElementById("currentYear");

const state = {
  currentCreature: null,
  bestiary: [],
};

const rarities = [
  { name: "Common", symbol: "⚪", min: 1, max: 45, color: "rgba(255,255,255,0.16)" },
  { name: "Uncommon", symbol: "🟢", min: 46, max: 65, color: "rgba(80,200,120,0.28)" },
  { name: "Rare", symbol: "🔵", min: 66, max: 80, color: "rgba(30,144,255,0.28)" },
  { name: "Epic", symbol: "🟣", min: 81, max: 90, color: "rgba(148,0,211,0.28)" },
  { name: "Legendary", symbol: "🟡", min: 91, max: 97, color: "rgba(255,215,0,0.28)" },
  { name: "Mythical", symbol: "✨", min: 98, max: 100, color: "rgba(255,255,255,0.35)" },
];

const classes = ["Beast", "Titan", "Guardian", "Ancient Spirit", "Predator", "Celestial"];

const nameFragments = {
  prefixes: ["Storm", "Ember", "Frost", "Shadow", "Iron", "Thunder", "Solar", "Mist", "Rune", "Dusk"],
  middles: ["fang", "claw", "wing", "maw", "scale", "crest", "heart", "flare", "spire", "bloom"],
  endings: ["bane", "song", "prowess", "shard", "flare", "soul", "roar", "strike", "glow", "whisper"],
};

const loreTemplates = [
  "{name} roams the {habitat}, channeling {element} energy through its {head} head and {body} frame.",
  "Forged in the {habitat}, {name} carries the essence of {element} in every heartbeat.",
  "Legends say the {element} currents swirl around {name} as it protects the {habitat}.",
  "A {class} born of {element} and ancient craft, {name} stalks the {habitat} with a noble gaze.",
  "The {head} head of {name} whispers ancient runes while its {body} body moves like {element} itself.",
];

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildCreatureName(head, body, element) {
  const prefix = randomChoice(nameFragments.prefixes);
  const middle = randomChoice(nameFragments.middles);
  const ending = randomChoice(nameFragments.endings);
  const traitBlend = `${head}${body}`.slice(0, 6);
  const cleanBlend = traitBlend.replace(/[^A-Za-z]/g, "");
  return `${prefix}${middle}${cleanBlend.charAt(0).toUpperCase()}${ending}`;
}

function determineRarity(power) {
  return rarities.find((rarity) => power >= rarity.min && power <= rarity.max) || rarities[0];
}

function determineClass(power) {
  if (power >= 92) return "Celestial";
  if (power >= 82) return "Titan";
  if (power >= 72) return "Guardian";
  if (power >= 58) return "Ancient Spirit";
  if (power >= 45) return "Predator";
  return "Beast";
}

function determinePowerTier(power) {
  if (power >= 88) return "S Tier";
  if (power >= 72) return "A Tier";
  if (power >= 55) return "B Tier";
  return "C Tier";
}

function createLore(data) {
  const template = randomChoice(loreTemplates);
  return template
    .replace("{name}", data.name)
    .replace("{habitat}", data.habitat.toLowerCase())
    .replace("{element}", data.element.toLowerCase())
    .replace("{head}", data.headType.toLowerCase())
    .replace("{body}", data.bodyType.toLowerCase())
    .replace("{class}", data.creatureClass.toLowerCase());
}

function getRarityGlowStyle(rarity) {
  const found = rarities.find((item) => item.name === rarity);
  return found ? found.color : "rgba(255,255,255,0.12)";
}

function mapToPowerInfluence(element, habitat) {
  const elementBoost = { Fire: 6, Water: 4, Ice: 3, Lightning: 7, Earth: 5, Nature: 4, Shadow: 6, Light: 6 };
  const habitatBoost = { Mountains: 5, Forest: 4, Desert: 3, Volcano: 7, Ocean: 5, Tundra: 3, "Sky Realm": 6, "Ancient Ruins": 6 };
  return (elementBoost[element] || 4) + (habitatBoost[habitat] || 4);
}

function generateCreature(selected) {
  const base = getRandomBetween(24, 82);
  const boost = mapToPowerInfluence(selected.element, selected.habitat);
  const power = Math.min(100, Math.max(1, base + boost + getRandomBetween(-6, 10)));
  const rarity = determineRarity(power);
  const creatureClass = determineClass(power);
  const name = buildCreatureName(selected.headType, selected.bodyType, selected.element);
  const lore = createLore({
    ...selected,
    name,
    creatureClass,
  });
  return {
    id: Date.now(),
    name,
    headType: selected.headType,
    bodyType: selected.bodyType,
    element: selected.element,
    habitat: selected.habitat,
    powerLevel: power,
    rarity: rarity.name,
    raritySymbol: rarity.symbol,
    rarityColor: rarity.color,
    creatureClass,
    lore,
    favorite: false,
    createdAt: new Date().toISOString(),
  };
}

function renderCreature(creature) {
  if (!creature) return;
  creatureNameEl.textContent = creature.name;
  rarityBadge.textContent = `${creature.raritySymbol} ${creature.rarity}`;
  rarityBadge.style.background = creature.rarityColor;
  rarityText.textContent = creature.rarity;
  powerLevel.textContent = creature.powerLevel;
  elementText.textContent = creature.element;
  habitatText.textContent = creature.habitat;
  classText.textContent = creature.creatureClass;
  creatureLore.textContent = creature.lore;
  powerTier.textContent = determinePowerTier(creature.powerLevel);
  favoriteButton.textContent = creature.favorite ? "★ Favorited" : "☆ Favorite";
  favoriteButton.classList.toggle("active", creature.favorite);
  const glow = getRarityGlowStyle(creature.rarity);
  document.querySelector(".result-card").style.boxShadow = `0 28px 80px ${glow}`;
}

function renderBestiary() {
  bestiaryList.innerHTML = "";
  if (!state.bestiary.length) {
    bestiaryList.innerHTML = `<p class="empty-note">No creatures forged yet. Start creating to fill the bestiary.</p>`;
    strongestCreature.textContent = "No entries yet";
    rarestCreature.textContent = "No entries yet";
    averagePower.textContent = "—";
    return;
  }
  state.bestiary.forEach((creature) => {
    const el = document.createElement("div");
    el.className = "bestiary-item";
    el.innerHTML = `
      <div>
        <strong>${creature.name}</strong>
        <small>${creature.element} ${creature.habitat}</small>
      </div>
      <div>
        <span>${creature.raritySymbol} ${creature.rarity}</span>
      </div>
      <div>
        <strong>${creature.powerLevel}</strong>
        <small>Power</small>
      </div>
      <div>
        <strong>${creature.creatureClass}</strong>
        <small>Class</small>
      </div>
      <button data-id="${creature.id}" class="favorite-tile">${creature.favorite ? "★" : "☆"}</button>
    `;
    bestiaryList.appendChild(el);
  });

  const strongest = state.bestiary.reduce((top, entry) => (entry.powerLevel > top.powerLevel ? entry : top), state.bestiary[0]);
  const rarityRank = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5, Mythical: 6 };
  const rarest = [...state.bestiary].sort((a, b) => rarityRank[b.rarity] - rarityRank[a.rarity] || b.powerLevel - a.powerLevel)[0];
  const average = Math.round(state.bestiary.reduce((sum, entry) => sum + entry.powerLevel, 0) / state.bestiary.length);

  strongestCreature.textContent = `${strongest.name} — ${strongest.powerLevel}`;
  rarestCreature.textContent = `${rarest.name} — ${rarest.rarity}`;
  averagePower.textContent = `${average}`;
}

function saveBestiary() {
  localStorage.setItem("creatureForgeBestiary", JSON.stringify(state.bestiary));
}

function loadBestiary() {
  const stored = localStorage.getItem("creatureForgeBestiary");
  if (stored) {
    try {
      state.bestiary = JSON.parse(stored);
    } catch (error) {
      state.bestiary = [];
    }
  }
}

function updateCurrentCreature(creature) {
  state.currentCreature = creature;
  renderCreature(creature);
}

function forgeCurrentCreature() {
  const selected = {
    headType: headType.value,
    bodyType: bodyType.value,
    element: elementSelect.value,
    habitat: habitatSelect.value,
  };
  const creature = generateCreature(selected);
  updateCurrentCreature(creature);
  state.bestiary.unshift(creature);
  saveBestiary();
  renderBestiary();
}

function generateRandomCreature() {
  headType.selectedIndex = Math.floor(Math.random() * headType.options.length);
  bodyType.selectedIndex = Math.floor(Math.random() * bodyType.options.length);
  elementSelect.selectedIndex = Math.floor(Math.random() * elementSelect.options.length);
  habitatSelect.selectedIndex = Math.floor(Math.random() * habitatSelect.options.length);
  forgeCurrentCreature();
}

function toggleFavorite(id) {
  const creature = state.bestiary.find((entry) => entry.id === id);
  if (!creature) return;
  creature.favorite = !creature.favorite;
  saveBestiary();
  renderBestiary();
  if (state.currentCreature && state.currentCreature.id === id) {
    state.currentCreature.favorite = creature.favorite;
    renderCreature(state.currentCreature);
  }
}

function attachListeners() {
  forgeButton.addEventListener("click", (event) => {
    event.preventDefault();
    forgeCurrentCreature();
  });

  randomButton.addEventListener("click", (event) => {
    event.preventDefault();
    generateRandomCreature();
  });

  favoriteButton.addEventListener("click", () => {
    if (!state.currentCreature) return;
    state.currentCreature.favorite = !state.currentCreature.favorite;
    const stored = state.bestiary.find((entry) => entry.id === state.currentCreature.id);
    if (stored) {
      stored.favorite = state.currentCreature.favorite;
      saveBestiary();
      renderBestiary();
    }
    renderCreature(state.currentCreature);
  });

  bestiaryList.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-id]");
    if (!target) return;
    const id = Number(target.dataset.id);
    toggleFavorite(id);
  });
}

function init() {
  currentYear.textContent = new Date().getFullYear();
  loadBestiary();
  if (state.bestiary.length > 0) {
    updateCurrentCreature(state.bestiary[0]);
  }
  renderBestiary();
  attachListeners();
}

init();
