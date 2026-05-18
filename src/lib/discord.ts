export type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline';

export const statusColors: Record<DiscordStatus, string> = {
	online: '#57F287',
	idle: '#FEE75C',
	dnd: '#ED4245',
	offline: '#52555B',
};

export function getAvatarUrl(user: { id: string; avatar: string | null }): string {
	if (user.avatar) {
		return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
	}
	const index = Number((BigInt(user.id) >> 22n) % 6n);
	return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

export function getDisplayName(user: {
	username: string;
	global_name?: string | null;
	display_name?: string | null;
}): string {
	return user.global_name ?? user.display_name ?? user.username;
}

export interface LanyardPresence {
	discord_user: {
		id: string;
		username: string;
		global_name?: string | null;
		display_name?: string | null;
		avatar: string | null;
	};
	discord_status: DiscordStatus;
}

export async function fetchLanyardPresence(
	discordUserId: string,
): Promise<LanyardPresence | null> {
	const res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
	if (!res.ok) throw new Error(`Lanyard: HTTP ${res.status}`);

	const body = (await res.json()) as { success: boolean; data?: LanyardPresence; error?: string };
	if (!body.success || !body.data) {
		throw new Error(body.error ?? 'Lanyard: user not found (join discord.gg/UrRy6ae)');
	}

	return body.data;
}
