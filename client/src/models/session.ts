import { reactive } from 'vue';

type Cookies = {
	get: (keyName: string) => string;
	set: (keyName: string, value: string) => any;
};

export interface ISession {
	isLoggedIn: 'true' | 'false';
	token: string | null;
	username: string | null;
}

export const session: ISession = reactive<ISession>({
	isLoggedIn: 'false',
	token: null,
	username: null
});

export const endSession = (cookies: Cookies) => {
	session.isLoggedIn = 'false';
	session.token = null;
	session.username = null;
	cookies.set('isLoggedIn', 'false');
	cookies.set('token', '');
	cookies.set('username', '');
}

export const setSession = (
	{ token, username, isLoggedIn }: ISession,
	cookies: Cookies
) => {
	session.isLoggedIn = isLoggedIn;
	session.token = token;
	session.username = username;
	cookies.set('isLoggedIn', 'true');
	cookies.set('username', username ?? '');
	cookies.set('token', token ?? '');
};

export const getSession = (cookies: Cookies) => {
	session.isLoggedIn = cookies.get('isLoggedIn') == 'true' ? 'true' : 'false';
	session.token = cookies.get('token') || null;
	session.username = cookies.get('username') || null;
};
