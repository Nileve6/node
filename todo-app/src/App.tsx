import React, { FC, useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const App: FC = () => {
	interface List{
		name: string,
		id: string,
	}
	interface User{
		username: string,
		role: string,
	}
	const [user, setUser] = useState<User | null>({ username: 'Admin', role: 'admin'})
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
		//event?.preventDefault
		console.log(item)
		let itemId: string = (todoList.length + 1).toString();
		if(isEdit){
			itemId = isEdit;
			const newTodo: List = {
				name: item,
				id: itemId,
			}
			axios.put(backend_url, newTodo )
			.then(response => setTodoList(response.data))
		}else{
			const newTodo: List = {
				name: item,
				id: itemId,
			}
			axios.post(backend_url, newTodo )
			.then(response => console.log(response))
		}
		setEditItem('');
	}
	function edit(item: List){
		setTodo(item.name);
		setEditItem(item.id)
	}
	function remove(item: List){
		console.log(item);
		axios.delete(backend_url, {data: item})
		.then(response => setTodoList(response.data));
	}
	function logging(user: User | null){
		if(!user){
			axios.post(`http://localhost:5000/login`, {username: 'Admin' token: BEARER })
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
