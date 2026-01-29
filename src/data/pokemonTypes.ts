// Manually populated Pokemon Types (Primary Type)
export const POKEMON_TYPES: Record<string, string> = {
    '1': 'grass',    // Bulbasaur
    '3': 'grass',    // Venusaur
    '4': 'fire',     // Charmander
    '6': 'fire',     // Charizard
    '7': 'water',    // Squirtle
    '9': 'water',    // Blastoise
    '25': 'electric',// Pikachu
    '26': 'electric',// Raichu
    '31': 'poison',  // Nidoqueen
    '34': 'poison',  // Nidoking
    '39': 'normal',  // Jigglypuff (Fairy in Gen 6+)
    '40': 'normal',  // Wigglytuff
    '52': 'normal',  // Meowth
    '54': 'water',   // Psyduck
    '55': 'water',   // Golduck
    '58': 'fire',    // Growlithe
    '59': 'fire',    // Arcanine
    '62': 'water',   // Poliwrath
    '65': 'psychic', // Alakazam
    '68': 'fighting',// Machamp
    '76': 'rock',    // Golem
    '79': 'water',   // Slowpoke
    '80': 'water',   // Slowbro
    '91': 'water',   // Cloyster
    '94': 'ghost',   // Gengar
    '95': 'rock',    // Onix
    '103': 'grass',  // Exeggutor
    '106': 'fighting',// Hitmonlee
    '107': 'fighting',// Hitmonchan
    '112': 'ground', // Rhydon
    '113': 'normal', // Chansey
    '123': 'bug',    // Scyther
    '127': 'bug',    // Pinsir
    '129': 'water',  // Magikarp
    '130': 'water',  // Gyarados
    '131': 'water',  // Lapras
    '132': 'normal', // Ditto
    '133': 'normal', // Eevee
    '134': 'water',  // Vaporeon
    '135': 'electric',// Jolteon
    '136': 'fire',   // Flareon
    '142': 'rock',   // Aerodactyl
    '143': 'normal', // Snorlax
    '144': 'ice',    // Articuno
    '145': 'electric',// Zapdos
    '146': 'fire',   // Moltres
    '147': 'dragon', // Dratini
    '149': 'dragon', // Dragonite
    '150': 'psychic',// Mewtwo
    '151': 'psychic',// Mew
    'c1': 'fire'     // Custom Charmeleon/Lizard
};

export const TYPE_COLORS: Record<string, string> = {
    fire: '#f87171', // red-400
    water: '#60a5fa', // blue-400
    grass: '#4ade80', // green-400
    electric: '#facc15', // yellow-400
    psychic: '#c084fc', // purple-400
    normal: '#9ca3af', // gray-400
    fighting: '#ea580c', // orange-600
    flying: '#818cf8', // indigo-400
    poison: '#a855f7', // purple-500
    ground: '#ca8a04', // yellow-600
    rock: '#78716c', // stone-500
    bug: '#84cc16', // lime-500
    ghost: '#7c3aed', // violet-600
    steel: '#94a3b8', // slate-400
    dragon: '#6366f1', // indigo-500
    ice: '#22d3ee', // cyan-400
    fairy: '#f472b6', // pink-400
    dark: '#1f2937', // gray-800
};
