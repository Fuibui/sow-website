export const socials = [
	{ label: 'twitter', href: 'https://twitter.com/sowisgone' },
	{ label: 'yt_jobs', href: 'https://ytjobs.co/talent/profile/528200?r=386' },
	{ label: 'steam', href: 'https://steamcommunity.com/id/sowisgone/' },
	{ label: 'twitch', href: 'https://twitch.tv/sowisgonexd' },
];

export const projects = ['sweety inc, a pc tweaker', 'skulldye, a game'];

export const skills = ['js', 'writting', 'mcfunction', 'bat'];

export const about = {
	age: '18y',
	location: 'Brazil, PR',
	email: 'sowisgone@gmail.com',
};

export const posts = [{ label: 'blog', href: '/blog' }];

export const map = {
	phoneMasked: '+55 ** *****-****',
	image: '/img/map.webp',
};

export interface BlogDateEntry {
	id: string;
	label: string;
}

export const blogDates: BlogDateEntry[] = [
	{ id: '2026-05-18', label: '2026-05-18' },
	{ id: '2026-05-10', label: '2026-05-10' },
];

export const blogDayLog = {
	command: './day.log',
	content: 'TODO: blog post content will go here.',
};
