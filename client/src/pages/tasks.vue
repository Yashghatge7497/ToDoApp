<script>

import { endSession, session } from '../models/session';
import { useCookies } from 'vue3-cookies';
import router from '../router';
import axios from 'axios';

const { cookies } = useCookies();

export default {
   data () {
	const tabs = ["For me", "By me", "All"];
    return {
	  tabContent : ["For me", "By me", "All"],	
	  taskTitle : '',
	  taskDesc : '',
	  taskFor : '',
	  taskDate : '',
	  token : session.token,
	  username: session.username,
      doneTasks : [],
	  notDoneTasks : [],
	  currentTab: tabs[0],
	  modalState : false,
	  users : ["Nah","dad"]
    }
  },
  methods : {

	async getAllUsers(){
		const { data, status } = 
			await axios.get(`http://localhost:5000/api/users`,);
		this.users = data.map(e => e.userName)
	},

	logout() {
		endSession(cookies);
		router.push('/');
	},

	tabClass(tab) {
		if(tab === this.currentTab)
			return 'tasksSideBtn tabActive'
		return 'tasksSideBtn';
	},

	modalClass() {
		return this.modalState ? 'modal is-active' : 'modal';	
	},

	async changeTab(tab) {
		this.currentTab = tab;
		await this.getTasks();
	},

	async deleteTask(task){
		const { data, status } = await axios.delete(
			`http://localhost:5000/api/tasks/${task._id}`,
			{
				headers: {
				'x-auth-token': this.token,
				},
			},
		);
		if(status >= 200 && status < 300){
			this.doneTasks = this.doneTasks.filter(t => t._id !== task._id);
			this.notDoneTasks = this.notDoneTasks.filter(t => t._id !== task._id);
		}
	},

	async changeDoneStatus(state,task){
		const taskToEdit = {
			by: task.username,
			date: task.taskDate,
			desc: task.taskDesc,
			done: state,
			for: task.taskFor,
			title: task.taskTitle
		};
		const { data, status } = await axios.put(
			`http://localhost:5000/api/tasks/${task._id}`,
			taskToEdit,
			{
				headers: {
				'x-auth-token': this.token,
				},
			},
		);
		if(status == 201){
			console.log(state);
			if(!state){
				this.notDoneTasks = [...this.notDoneTasks, data]
				this.doneTasks = this.doneTasks.filter(task => task._id !== data._id);
				console.log(this.doneTasks);
			}
			else {
				this.doneTasks = [...this.doneTasks, data]
				this.notDoneTasks = this.notDoneTasks.filter(task => task._id !== data._id);
				console.log(this.notDoneTasks);
			}
		}
	},

	async getTasks() {
		if(this.currentTab == this.tabContent[0]){
			const { data, status } = await axios.get(
				`http://localhost:5000/api/tasks?for=${this.username}`,
				{
					headers: {
					'x-auth-token': this.token,
					},
				},
			);

			console.log(data);
			if(status >= 200 && status < 300){
				this.doneTasks = data.filter(t => t.done);
				this.notDoneTasks = data.filter(t => !t.done);
			}
			else {
				this.doneTasks = [];
				this.notDoneTasks = [];
			}
		}
	
		else if(this.currentTab == this.tabContent[1]){
			const { data, status } = await axios.get(
				`http://localhost:5000/api/tasks?by=${this.username}`,
				{
					headers: {
					'x-auth-token': this.token,
					},
				},
			);
			if(status >= 200 && status < 300){
				this.doneTasks = data.filter(t => t.done);
				this.notDoneTasks = data.filter(t => !t.done);
			}
			else {
				this.doneTasks = [];
				this.notDoneTasks = [];
			}
		}

		else {
			const { data, status } = await axios.get(
				`http://localhost:5000/api/tasks`,
				{
					headers: {
					'x-auth-token': this.token,
					},
				},
			);
			if(status >= 200 && status < 300){
				this.doneTasks = data.filter(t => t.done);
				this.notDoneTasks = data.filter(t => !t.done);
			}
			else {
				this.doneTasks = [];
				this.notDoneTasks = [];
			}
		}
	},

	async addTask () {
		if(!this.username) return;
		const taskToCreate = {
			by: this.username,
			date: this.taskDate,
			desc: this.taskDesc,
			done: false,
			for: this.taskFor,
			title: this.taskTitle
		};
		const { data, status } = await axios.post(
			`http://localhost:5000/api/tasks`,
			taskToCreate,
			{
				headers: {
				'x-auth-token': this.token,
				},
			},
		);
		if(status == 201){
			this.notDoneTasks = [...this.notDoneTasks, data]
		}
		this.modalState = false;
	}
  },
  async created () {
    await this.getAllUsers();
	await this.getTasks();
  }
}
</script>

<template>
	<div :class="modalClass(modalState)">
  	<div class="modal-background" @click="()=>modalState=false"></div>
  	<div class="modal-content">
  	  <div class="card">
				<h1>Add Task</h1>
				<input class="input is-normal" type="text" placeholder="Title" v-model="taskTitle" />
				<input class="input is-normal" type="text" placeholder="Description" v-model="taskDesc" />

				<div class="dropdown is-hoverable">
					<div class="dropdown-trigger">
						<div class="field">
							<div class="control">
								<input class="input is-normal" type="search	" placeholder="For" v-model="taskFor" />
							</div>
						</div>
					</div>
					<div class="dropdown-menu" id="dropdown-menu" role="menu">
						<div class="dropdown-content">
								<a href="#" class="dropdown-item" 
									v-for="user in users" @click="()=>taskFor=user">
									{{user}}
								</a>
						</div>
					</div>
				</div>

				<input class="input is-normal" type="date" placeholder="Date" v-model="taskDate" />
				<button class="button is-normal" @click="addTask">Add</button>
			</div>
  	</div>
  	<button class="modal-close is-large" aria-label="close" @click="()=>modalState=false"></button>
	</div>

	<nav>
		<div class="sessionContainer">
			<p>{{ username }}</p>
			<button @click="logout" class="is-normal is-outlined">Log Out</button>
		</div>
	</nav>

	<div class="columns is-multiline">
		<div class="column is-one-quarter">
			<div id="tasksSideCard" class="card">
				<div class="tasksHeading">T A S K S</div>
				<div class="taksSideBtnGrp">
					<div class="tasksSideBtnAction" @click="() => modalState = true">Add</div>
				</div>
				<div class="taksSideBtnGrp">
					<div :class="tabClass(tab)" v-for="tab in tabContent" @click="changeTab(tab)">{{tab}}</div>
				</div>
			</div>
		</div>

		<div class="column">
			<div id="tasksRightPanel" class="card">
				<div class="columns is-multiline">
					<div class="column is-half">
						<div class="tasksColHeading">TO DO</div>
						<div class="columns cardsList">
							<div class="column is-full cardHolder">
								<div class="card taskCard" 
									v-for="task in notDoneTasks"
									:key="task.title"
								>
									<div class="assignedTo">{{ task.for }}</div>
									<div class="taskCardTitle">{{ task.title }}</div>
									<div class="taskCardDetails">{{ task.desc }}</div>
									<div class="taskCardDeadline">
										<img src="../assets/svg/time.svg" style="height: 20px;" width="20px" />
										<p class="deadlineText">{{ task.date }} • {{ task.by }}</p>
									</div>
									<label class="checkbox taskCheckbox" >
										Done
										<input type="checkbox" v-model="task.done" 
										@change="changeDoneStatus(true,task)">
									</label>
									<button 
										v-if="task.by == username" 
										@click="deleteTask(task)"
										class="delete-todo">
										Delete
									</button>
								</div>
							</div>
						</div>
					</div>
					<div class="column is-half">
						<div class="tasksColHeading">DONE</div>
						<div class="columns cardsList">
							<div class="column is-full cardHolder">
								<div class="card taskCard" 
									v-for="task in doneTasks"
									:key="task.title"
								>
									<div class="assignedTo">{{ task.for }}</div>
									<div class="taskCardTitle">{{ task.title }}</div>
									<div class="taskCardDetails">{{ task.desc }}</div>
									<div class="taskCardDeadline">
										<img src="../assets/svg/time.svg" style="height: 20px;" width="20px" />
										<p class="deadlineText">{{ task.date }} • {{ task.by }}</p>
									</div>
									<label class="checkbox taskCheckbox">
										Done
										<input 
											type="checkbox" 
											@change="changeDoneStatus(false,task)"
											v-model="task.done">
									</label>
									<button 
										@click="deleteTask(task)"
										v-if="task.by == username" 
										class="delete-todo">
										Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">

.delete-todo {
	margin-left: 10px;
	margin-bottom: 10px;
}

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

		.dropdown.is-hoverable {
			width: 80%;

			.dropdown-trigger {
				width: 100%;

				input {
					width: 100%;
				}
			}
		}

		input {
			margin-top: 20px;
			width: 80%;
		}

		button {
			margin-top: 20px;
		}
	}
}

nav {
	display: flex;
	position: absolute;
	top: 0;
	height: 100px;
	width: 100%;
	background-color: transparent;

	.sessionContainer {
		display: flex;
		position: absolute;
		right: 0;
		margin: 20px;

		p {
			font-family: "Roboto";
			font-weight: 500;
			margin: 10px 20px;
		}

		button {
			font-family: "Roboto";
			font-weight: 500;
		}
	}
}

.cardHolder {
	display: flex;
	flex-direction: column;
}

.deadlineText {
	font-family: "Roboto";
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	margin-left: 5px;
	color: #808080;
}

.taskCardDeadline {
	position: relative;
	display: flex;
	flex-direction: row;
	margin: 20px 20px;
}

.taskCardDetails {
	position: relative;
	top: 5px;
	left: 20px;
	font-family: "Roboto";
	font-style: normal;
	font-weight: 400;
	font-size: 16px;
}

.taskCardTitle {
	position: relative;
	left: 20px;
	font-family: "Roboto";
	font-style: normal;
	font-weight: 500;
	font-size: 20px;
}

.assignedTo {
	position: relative;
	margin: 15px;
	width: 100px;
	height: 20px;
	background-color: red;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-family: "Roboto";
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
}

.taskCard {
	height: fit-content !important;
	margin-top: 20px;
	box-shadow: 0px 17px 162px rgba(0, 0, 0, 0.031357),
		0px 5.125px 48.8383px rgba(0, 0, 0, 0.045),
		0px 2.12866px 20.2849px rgba(0, 0, 0, 0.058643),
		0px 0.769896px 7.33666px rgba(0, 0, 0, 0.09) !important;
}

.cardsList {
	margin-top: 50px;
	height: calc(100% - 50px) !important;
	width: 100%;
	align-items: flex-start;
}

.tasksColHeading {
	position: absolute;
	top: 0;
	display: flex;
	height: 80px;
	line-height: 80px;
	font-family: "Montserrat";
	font-style: normal;
	font-weight: 600;
	font-size: 20px;
	text-align: center;
	color: #9e9e9e;
}

#tasksRightPanel {
	display: unset;
	top: 0;
}

.card {
	height: 80%;
	width: 80%;
	border-radius: 10px;
	box-shadow: 0px 17px 80px rgba(0, 0, 0, 0.07),
		0px 7.10219px 33.4221px rgba(0, 0, 0, 0.0503198),
		0px 3.79717px 17.869px rgba(0, 0, 0, 0.0417275),
		0px 2.12866px 10.0172px rgba(0, 0, 0, 0.035),
		0px 1.13052px 5.32008px rgba(0, 0, 0, 0.0282725),
		0px 0.470434px 2.21381px rgba(0, 0, 0, 0.0196802);
}

.tasksHeading {
	width: 100%;
	height: 50px;
	position: absolute;
	top: 0;
	border-radius: 10px 10px 0px 0px;
	background-color: #353535;
	color: white;
	align-items: center;
	justify-content: center;
	display: flex;

	font-family: "Montserrat";
	font-style: normal;
	font-weight: 600;
	font-size: 18px;
}

.tasksSideBtn,
.tasksSideBtnAction {
	border-radius: 10px;
	width: 80%;
	height: 50px;
	line-height: 50px;
	background-color: #efefef;
	margin-top: 30px;
	text-align: center;
	font-family: "Montserrat";
	font-style: normal;
	font-weight: 600;
	font-size: 18px;
	cursor: pointer;
}

.tabActive {
	border: 2px solid #cdcdcd;
}

.tasksSideBtn {
	background-color: #efefef;
}

.tasksSideBtnAction {
	background-color: #ece7fc;
}

.tasksSideBtn:hover,
.tasksSideBtnAction:hover {
	border: 2px solid #cdcdcd;
}

.tasksSideBtnBorder {
	border: 2px solid #cdcdcd;
}

.taskCheckbox {
	position: absolute;
	right: 20px;
	bottom: 20px;
	font-family: 'Roboto';
	font-size: 14px;
	font-weight: 500;
	display: flex;
  align-items: center;
  justify-content: space-between;
  width: 50px;
}


.columns {
	height: 100%;
}

.column {
	display: flex;
	align-items: center;
	justify-content: center;
}

#tasksSideCard {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.taksSideBtnGrp {
	display: flex;
	align-items: center;
	justify-content: space-around;
	flex-direction: column;
	width: 100%;
}
</style>


<!-- 
<template>
<div class="wrapper">
  <div class="content">
    <div class="title">
      <h1>{{title}}</h1>
	  <button @click="getTasks()">GET TASKS</button>
    </div>
  </div>
</div>
</template>

<script>

import axios from 'axios'
export default {
  data () {
    return {
      title : null
    }
  },
  methods : {
	async getTasks () {
		const { data, status }= await axios.get(
			`http://localhost:5000/api/tasks`,
			{
				headers: {
				'x-auth-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MjcwZjc3MDg4YjIxYWVlMTdjMzM5MWIiLCJ1c2VyTmFtZSI6Ik5haG9tIiwiaWF0IjoxNjUxNTgwMDgzfQ.bf46NbP8lAq9Pr_IAdAGFe8CtIEAlRnXahci0aLwcuA",
				},
			}
		);
		this.title=data[0].title;
	}
  },
  async created () {
    
  }
}
</script>
-->