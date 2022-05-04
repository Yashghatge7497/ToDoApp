import { ref } from 'vue';

export interface IUser {
	username: string;
	password: string;
}

export const users = ref<IUser[]>([
	{
		username: 'John',
		password: 'something',
	},
	{
		username: 'Jane',
		password: 'something',
	},
]);
