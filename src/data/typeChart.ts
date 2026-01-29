export const TYPE_CHART: Record<string, string[]> = {
    fire: ['grass', 'ice', 'bug', 'steel'],
    water: ['fire', 'ground', 'rock'],
    grass: ['water', 'ground', 'rock'],
    electric: ['water', 'flying'],
    ice: ['grass', 'ground', 'flying', 'dragon'],
    fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
    poison: ['grass', 'fairy'],
    ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
    flying: ['grass', 'fighting', 'bug'],
    psychic: ['fighting', 'poison'],
    bug: ['grass', 'psychic', 'dark'],
    rock: ['fire', 'ice', 'flying', 'bug'],
    ghost: ['psychic', 'ghost'],
    dragon: ['dragon'],
    steel: ['ice', 'rock', 'fairy'],
    dark: ['psychic', 'ghost'],
    fairy: ['fighting', 'dragon', 'dark'],
    normal: [] // Weak against nothing (offensive), but Fighting hits it hard. Logic here: Key is ATTACKER. Value is targets it is STRONG against (1.5x).
};

export const getDamageMultiplier = (attackerType: string = 'normal', defenderType: string = 'normal'): number => {
    // Basic Effectiveness (1.5x)
    const strongAgainst = TYPE_CHART[attackerType.toLowerCase()] || [];
    if (strongAgainst.includes(defenderType.toLowerCase())) {
        return 1.5;
    }

    // Weakness (0.5x) - Optional, but keeping simple for now as per request (1.5x emphasis)
    // Could define RESISTANCE_CHART if needed.

    return 1.0;
};
