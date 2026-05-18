export interface SteamGame {
	name: string;
	hours: number;
	done: number;
	total: number;
	pct: number;
}

const OWNED_GAMES_URL = 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/';
const ACHIEVEMENTS_URL = 'https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/';
/** Top N games by playtime — keeps build/dev requests reasonable */
const MAX_GAMES = 10;

interface OwnedGame {
	appid: number;
	name: string;
	playtime_forever: number;
}

async function fetchOwnedGames(apiKey: string, steamId: string): Promise<OwnedGame[]> {
	const url = new URL(OWNED_GAMES_URL);
	url.searchParams.set('key', apiKey);
	url.searchParams.set('steamid', steamId);
	url.searchParams.set('include_appinfo', 'true');
	url.searchParams.set('include_played_free_games', 'true');
	url.searchParams.set('format', 'json');

	const res = await fetch(url);
	if (!res.ok) throw new Error(`Steam owned games: HTTP ${res.status}`);

	const data = await res.json();
	const games: OwnedGame[] = data.response?.games ?? [];
	return games.sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, MAX_GAMES);
}

async function fetchGameStats(
	apiKey: string,
	steamId: string,
	game: OwnedGame,
): Promise<SteamGame | null> {
	const url = new URL(ACHIEVEMENTS_URL);
	url.searchParams.set('key', apiKey);
	url.searchParams.set('steamid', steamId);
	url.searchParams.set('appid', String(game.appid));
	url.searchParams.set('format', 'json');

	const res = await fetch(url);
	if (!res.ok) return null;

	const data = await res.json();
	const achievements = data.playerstats?.achievements ?? [];
	const total = achievements.length;
	if (total === 0) return null;

	const done = achievements.filter((a: { achieved: number }) => a.achieved).length;

	return {
		name: game.name,
		hours: Math.ceil(game.playtime_forever / 60),
		total,
		done,
		pct: Math.round((done / total) * 100),
	};
}

export async function fetchSteamGames(): Promise<SteamGame[]> {
	const apiKey = import.meta.env.STEAM_API_KEY;
	const steamId = import.meta.env.STEAM_ID;

	if (!apiKey || !steamId) {
		console.warn('[steam] STEAM_API_KEY or STEAM_ID missing in .env');
		return [];
	}

	const owned = await fetchOwnedGames(apiKey, steamId);
	const results = await Promise.all(
		owned.map((game) => fetchGameStats(apiKey, steamId, game)),
	);

	return results
		.filter((game): game is SteamGame => game !== null)
		.sort((a, b) => b.pct - a.pct || b.hours - a.hours);
}
