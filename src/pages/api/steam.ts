import type { APIRoute } from 'astro';
import { fetchSteamGames } from '../../lib/steam';

export const prerender = false;

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});

export const GET: APIRoute = async () => {
	const apiKey = import.meta.env.STEAM_API_KEY;
	const steamId = import.meta.env.STEAM_ID;

	if (!apiKey || !steamId) {
		return json({
			games: [],
			error: 'STEAM_API_KEY / STEAM_ID not set in .env',
		});
	}

	try {
		const games = await fetchSteamGames();
		if (!games.length) {
			return json({ games: [], error: 'no games with achievements found.' });
		}
		return json({ games });
	} catch (err) {
		const message =
			err instanceof Error ? err.message : 'failed to load steam stats.';
		return json({ games: [], error: message }, 500);
	}
};
