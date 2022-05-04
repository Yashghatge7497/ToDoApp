<script setup lang="ts">

import './assets/main.scss';
import { useCookies } from 'vue3-cookies';
import { session, getSession } from './models/session';
import router from './router';

const { cookies } = useCookies();

getSession(cookies);

if (session.isLoggedIn == "true") router.push('/tasks');

</script>

<template>
	<router-view />
</template>

<style>
#app {
	width: 100%;
	height: 100%;
}
</style>
