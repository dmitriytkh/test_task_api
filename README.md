# test_task_api

Start application:

start server: in the project root folder, run the command "php -S localhost:8000 index.php"

open file index.html in a browser.

Api documentation:

Get all tasks:
GET: http://localhost:8000/tasks
return json object with all tasks.

Get task by id:
GET: http://localhost:8000/tasks/{id}
return json object with task{id}.

Create new task:
POST: http://localhost:8000/tasks
input: int parent_id, string name; 
return json last insert id.

Update task:
PUT: http://localhost:8000/tasks/{id}
input: string name.

Delete task:
DELETE: http://localhost:8000/tasks/{id}
