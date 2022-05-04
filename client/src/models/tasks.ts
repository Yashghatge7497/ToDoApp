import { Ref, ref } from 'vue';

export interface ITask {
	title: string;
	desc: string;
	date: string;
	for: string;
	by: string;
	done: boolean;
}

export const tasks: Ref<ITask[]> = ref<ITask[]>([
	{
		title: 'NodeJS',
		desc: 'Update NodeJS',
		by: 'John',
		for: 'Jane',
		date: '24-03-2022',
		done: false,
	},
	{
		title: 'Vue',
		desc: 'Update Vue',
		by: 'Jane',
		for: 'John',
		date: '25-03-2022',
		done: true,
	},
	{
		title: 'Bulma',
		desc: 'Update Bulma',
		by: 'Jane',
		for: 'John',
		date: '25-03-2022',
		done: true,
	},
	{
		title: 'Bulma',
		desc: 'Update Bulma',
		by: 'Jane',
		for: 'John',
		date: '25-03-2022',
		done: true,
	},
]);
