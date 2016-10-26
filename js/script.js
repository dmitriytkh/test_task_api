const main = document.querySelector('main');

function attachControls(listElement) {
	const createButton = document.createElement('a');
	const deleteButton = document.createElement('a');

	deleteButton.addEventListener('click', function() {
		deleteTask(listElement.id);
		listElement.parentNode.removeChild(listElement)
	});
	deleteButton.innerHTML = 'delete';

	createButton.addEventListener('click', function() {
		createTask({
			id: listElement.id,
			name: 'new task',
			parentElement: listElement
		});
	});
	createButton.innerHTML = 'create'

	listElement.appendChild(createButton);
	listElement.appendChild(deleteButton);
}

function updateTask(elementId, nameInput) {
	var xhr = new XMLHttpRequest();
	xhr.open('PUT', 'http://localhost:8000/tasks/' + elementId);
	xhr.onload = function() {
		if (xhr.status === 200) {
			return xhr.response;
		}
	};
	xhr.send(JSON.stringify({
		name: nameInput
	}));
}

function createTask(objectInput) {
	const list = document.createElement('ul');
	const listElement = document.createElement('li');
	const name = document.createElement('span');
	
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://localhost:8000/tasks');
	xhr.onload = function() {
		if (xhr.status === 200) {
			var insertId = xhr.response;
			name.innerHTML = objectInput.name;
			listElement.id = insertId;
			name.setAttribute('contentEditable', 'true');
			name.addEventListener('blur', function() {
				updateTask(listElement.id, this.innerHTML);
			});
			listElement.appendChild(name);
			attachControls(listElement, insertId);
			list.appendChild(listElement);
			objectInput.parentElement.appendChild(list);
		} else {
			return false;
		}
	};
	xhr.send(JSON.stringify({
		parent_id: objectInput.id,
		name: objectInput.name
	}));
}

function deleteTask(elementId) {
	var xhr = new XMLHttpRequest();
	xhr.open('DELETE', 'http://localhost:8000/tasks/' + elementId);
	xhr.send(null);
	xhr.onload = function() {
		if (xhr.status === 200) {
			return xhr.response;
		}
	};
}

init(main);

function init(listElement) {
	const nameInput = document.createElement('input');
	const createButton = document.createElement('a');

	createButton.addEventListener('click', function() {
		createTask({
			id: this.id,
			name: nameInput.value || 'new task',
			parentElement: listElement
		});
		nameInput.value = '';
	});
	createButton.innerHTML = 'create';
	createButton.id = 0;

	listElement.appendChild(nameInput);
	listElement.appendChild(createButton);
	listElement.appendChild(document.createElement('hr'));

	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://localhost:8000/tasks');
	xhr.responseType = 'json';
	xhr.send(null);
	xhr.onload = function() {
		if (xhr.status === 200) {
			var tasks = xhr.response;
			for (key in tasks) {
				var parentElement = listElement;

				if (tasks[key].parent_id != 0) {
					parentElement = document.getElementById(tasks[key].parent_id);
				}
				var list = document.createElement('ul');
				var listElementLi = document.createElement('li');
				var name = document.createElement('span');
				
				name.innerHTML = tasks[key].name;
				listElementLi.id = tasks[key].id;
				name.setAttribute('contentEditable', 'true');
				name.addEventListener('blur', function() {
					updateTask(this.parentNode.id, this.innerHTML);
				});
				listElementLi.appendChild(name);
				attachControls(listElementLi, tasks[key].id);
				list.appendChild(listElementLi);
				parentElement.appendChild(list);
			};
		}
	};
}