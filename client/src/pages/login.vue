<script setup lang="ts">

import { ref } from "vue";
import { useCookies } from 'vue3-cookies';
import { setSession } from '../models/session';
import router from '../router';
import axios from 'axios';

const username = ref('');
const password = ref('');
const incorrect = ref('invisible');

const { cookies } = useCookies();

const login = async () => {
	
	const response = await axios.post('http://localhost:5000/api/auth', {
		userName : username.value,
		password : password.value
	});

	if (response.status >= 200 && response.status < 300) {
		incorrect.value = "invisible";
		setSession({
			isLoggedIn: "true",
			token: response.data.token,
			username: username.value,
		}, cookies);
		router.push('/tasks');
	}

	else {
		incorrect.value = "visible";
		username.value = "";
		password.value = "";
	}
};

const modalState = ref<boolean>(false);

const modalClass = (modalState: boolean): string => modalState ? 'modal is-active' : 'modal';

const rUser = ref('');
const rPass = ref('');
const rCPass = ref('');
const rError = ref('');

const register = async () => {
	rError.value = ' ';

	if(rUser.value === '' || rPass.value === '' || rCPass.value === '')
		return rError.value = 'Some field is left empty';

	if(rPass.value !== rCPass.value)
		return rError.value = "Passwords don't match";

	await axios.post('http://localhost:5000/api/users', {
		userName : rUser.value,
		password : rPass.value
	});

	modalState.value = false;
	rUser.value = '';
	rPass.value = '';
	rCPass.value = '';
}

</script>

<template>
	<div id="loginContainer" class="tile is-ancestor">
		<div id="loginSideContent" class="content tile is-vertical is-6">
			<div class="container">
				<div id="imgContainer" class="container">
					<figure class="image">
						<img id="loginSideIll" class="is-square" src="../assets/svg/loginSideIllustration.svg" />
					</figure>
				</div>

				<h1 id="loginTitle">To Do App</h1>
				<p id="loginSubtitle">Organize your tasks and get stuff done!</p>
			</div>
		</div>

		<div class="tile is-vertical is-6">
			<div id="loginBox" class="box container vcenter">
				<h2 id="loginFormTitle">Login</h2>

				<div class="field">
					<label class="label">Username</label>
					<div class="control has-icons-left">
						<input class="input is-normal" type="text" placeholder="Username" v-model="username" />
						<span class="icon is-left">
							<img class="inputIcon" src="../assets/svg/user.svg" />
						</span>
					</div>
				</div>

				<div class="field">
					<label class="label">Password</label>
					<div class="control has-icons-left">
						<input
							class="input is-normal"
							type="password"
							placeholder="Password"
							v-model="password"
							v-on:keyup.enter="login"
						/>
						<span class="icon is-left">
							<img class="inputIcon" src="../assets/svg/password.svg" />
						</span>
					</div>
				</div>

				<div id="loginActionBar">
					<button id="loginBtn" class="button is-success" @click="login">Login</button>
					<button id="loginBtn" class="button is-info" style="margin-left: 20px;" @click="()=>modalState=true">Register</button>
					<span :class="incorrect">username or password incorrect!</span>
				</div>
			</div>
		</div>
	</div>

	<div :class="modalClass(modalState)">
  	<div class="modal-background" @click="()=>modalState=false"></div>
  	<div class="modal-content">
  	  <div class="card">
				<h1>Register</h1>
				<input class="input is-normal" type="text" placeholder="Username" v-model="rUser" />
				<input class="input is-normal" type="password" placeholder="Password" v-model="rPass" />
				<input class="input is-normal" type="password" placeholder="Confirm" v-model="rCPass" />
				<button class="button is-normal" @click="register">Register</button>
				<p>{{rError}}</p>
			</div>
  	</div>
  	<button class="modal-close is-large" aria-label="close" @click="()=>modalState=false"></button>
	</div>
</template>

<style scoped lang="scss">

.modal-content {
	width: 500px;
	height: 600px;
	.card {
		display: flex;
		height: 100%;
		width: 100%;
		background-color: white;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		h1 {
			font: 'Roboto';
			font-size: 24px;
			font-weight: 500;
			margin-bottom: 20px;
		}

		input {
			margin-top: 20px;
			width: 80%;
		}

		button {
			margin-top: 20px;
		}

		p {
			position: absolute;
			bottom: 50px;
			color: red;
		}
	}
}

#loginActionBar {
	display: flex;
	float: left;
	justify-content: space-between;
	align-items: center;
}

#loginActionBar > span {
	padding-left: 30px;
	color: red;
	font-family: 'Montserrat';
}

#loginBtn {
	margin: 10px 0 auto auto;
}

#loginFormTitle {
	font-family: "Montserrat";
	font-style: normal;
	font-weight: 600;
	font-size: 24px;
	line-height: 29px;
	color: #1a1a1a;

	padding-bottom: 20px;
}

#loginBox {
	width: 70%;
	flex-grow: 0;
	padding: 40px;
}

#loginContainer {
	height: 100%;
}

#loginSideContent {
	width: 50%;
	height: 100%;
	background: #dadada;
}

#loginSideIll {
	width: 60%;
}

#imgContainer {
	padding-top: 20%;
}

#loginTitle {
	font-family: "Montserrat";
	font-style: normal;
	font-weight: 600;
	font-size: 48px;
	line-height: 59px;
	color: #1a1a1a;
	text-align: center;

	padding-top: 5%;
}

#loginSubtitle {
	font-family: "Montserrat";
	font-style: normal;
	font-weight: 400;
	font-size: 18px;
	line-height: 22px;
	color: #4e4e4e;
	text-align: center;
}
</style>