import React, { FC, useEffect, useState } from 'react';
import './App.css';
import axios, { AxiosRequestConfig } from 'axios';

const App: FC = () => {
	interface List{
		name: string,
		id: string,
	}
	interface User{
		username: string,
		role: string,
	}
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string>('');
	const [todoList, setTodoList] = useState<List[]>([]);
	const [todo, setTodo] = useState<string>('');
	const [editItem, setEditItem] = useState<string>('');
	const backend_url : string = `http://localhost:5000/todos`;
	document.title = 'ToDo App';

	useEffect(()=>{
		getData()
	},[])

	function getData(){
		fetch(backend_url).then(
			response => {
				console.log(response)
				return response.json()
			}
		).then(
			({data}) => {
				console.log(data)
				setTodoList(data)
				
			}
		)
	}

	// eslint-disable-next-line @typescript-eslint/typedef
	const add = (item: string, isEdit: string) => {
		event?.preventDefault
		const config: AxiosRequestConfig = {
			headers: { Authorization: `Bearer ${token}` }
		};
		let itemId: string = (todoList.length + 1).toString();
		if(isEdit){
			itemId = isEdit;
			const newTodo: List = {
				name: item,
				id: itemId,
			}
			axios.put(backend_url, newTodo, config)
			.then(response => {
				console.log(response)
				// eslint-disable-next-line no-debugger
				setTodoList(response.data)
			})
		}else{
			const newTodo: List = {
				name: item,
				id: itemId,
			}
			console.log(token)
			axios.post(backend_url, newTodo, config)
			.then(response => console.log(response))
		}
		setEditItem('');
	}
	function edit(item: List){
		setTodo(item.name);
		setEditItem(item.id)
	}
	function remove(item: List){
		axios.delete(backend_url, {headers: { Authorization: `Bearer ${token}` }, data: item})
		.then(response => {
			console.log('remove response:', response)
			setTodoList(response.data.data)
		})
	}
	function logging(user: User | null){
		if(!user){
			axios.post(`http://localhost:5000/login`, {username: 'Admin'})
			.then(response => {
				console.log(response.data.accessToken);
				setToken(response.data.accessToken);
			})
			setUser({ username: 'Admin', role: 'admin'});
			console.log(user)
		}
		if(user){
			setUser(null);
			console.log(user)
		}
	}
	return (
		<div className="App">
			<h1>ToDo App</h1>
			<section>
				<p></p>
				<button onClick={() => logging(user)}>{!user ? 'Login' : 'Logout'}</button>
			</section>
			<section>
				{ /*user?.role === 'admin' && */
					<form>
						<input value={todo} onChange={(event) => setTodo(event.target.value)} />
						<button id='add' onClick={() => add(todo, editItem)}>{!editItem ? 'Add' : 'Update'}</button>
					</form>
				}		
			</section>
			<section>
				<ul>
					{todoList.map(item =>
						<li key={item.name}>
							<p>{item.name}</p>
							{/*user?.role === 'admin' && */
								<>
									<button className='edit' onClick={() => edit(item)}>Edit</button>
									<button className='remove' onClick={() => remove(item)}>Remove</button>
								</>
							}
						</li>
					)}
				</ul>
			</section>
		</div>
	);
}

export default App;
