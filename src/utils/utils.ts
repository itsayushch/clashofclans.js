import fetch from 'node-fetch';

export function validateTag(msg: string, encode = false): string | false {
	if (!msg) return false;
	const tag = msg.toUpperCase().replace(/O/g, '0').replace('#', '');
	const tagRegex = /[0289PYLQGRJCUV]{3,9}/g;
	const result = tagRegex.exec(tag);
	return result ? encode ? encodeURIComponent(`#${result[0]}`) : `#${result[0]}` : false;
}

export async function fetchURL(url: string, token: string, timeout: number) {
	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json'
		},
		timeout
	}).catch(() => null);

	if (!res) return { ok: false, status: 504 };
	const parsed = await res.json().catch(() => null);
	if (!parsed) return { ok: false, status: res.status };

	const MAX_AGE = Number(res.headers.get('cache-control')!.split('=')[1]);
	return Object.assign(parsed, {
		maxAge: MAX_AGE,
		status: res.status,
		ok: res.status === 200
	});
}

export function seasonEnd(month: number, year = new Date().getFullYear()) {
	let day = 0;
	let lastDate = new Date(Date.UTC(year, month));
	while (true) {
		lastDate = new Date(Date.UTC(year, month, day, 5, 0));
		if (lastDate.getDay() === 1) break;
		day -= 1;
	}

	return lastDate;
}
