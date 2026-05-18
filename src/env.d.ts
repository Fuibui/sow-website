/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly DISCORD_USER_ID: string;
	readonly STEAM_API_KEY: string;
	readonly STEAM_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
