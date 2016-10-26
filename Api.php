<?php
header("Content-Type: application/json; charset=utf-8");
class Api
{
	private static $db = null;
	protected $connection;

	public static function connection_db() {
		if (self::$db == null) {
			self::$db = new Api();
		}
		return self::$db;
	}

	private function __construct()
	{
		$this->connection = new PDO('sqlite:sqlitedb.db');
		$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
		if (empty($request[0]) || $request[0] !== 'tasks') {
			http_response_code(404);
			die('Not found model');
		}
		$input = json_decode(file_get_contents('php://input'),true);
		$key = '';
		if ( ! empty($request[1])) {
			$key = $request[1];
		}
		$this->connection->exec("CREATE TABLE if not exists tasks (id INTEGER PRIMARY KEY, parent_id INTEGER, name TEXT);");
		switch ($_SERVER['REQUEST_METHOD']) {
			case 'GET':
				$this->action_get($key);
				break;
			case 'PUT':
				$this->action_put($key, $input);
				break;
			case 'POST':
				$this->action_post($input);
				break;
			case 'DELETE':
				$this->action_delete($key);
				break;
		}
	}

	public function action_get($key)
	{
		$sql = "select * from tasks" . ( ! empty($key) ? " WHERE id=$key" : '');
		$result = $this->connection->query($sql, PDO::FETCH_ASSOC)->fetchAll();
		if ( ! $result) {
			http_response_code(404);
			die('Not Found');
		}
		echo json_encode($result);
	}

	public function action_put($key, $input)
	{
		if (empty($key)) {
			http_response_code(404);
			die('Not found task');
		}
		if (empty($input)) {
			http_response_code(404);
			die('empty values for update');
		}
		$sql = $this->connection->prepare("UPDATE tasks SET name = ? WHERE id = ?;");
		$result = $sql->execute([$input['name'], $key]);
		if ( ! $result) {
			http_response_code(304);
			die('Not Modified');
		}
		echo 'sucsess';
	}

	public function action_post($input)
	{
		if (empty($input)) {
			http_response_code(404);
			die('empty values for create');
		}
		$sql = $this->connection->prepare("INSERT INTO tasks(parent_id, name) VALUES (?, ?);");
		$result = $sql->execute([$input['parent_id'], $input['name']]);
		if (empty($result)) {
			http_response_code(400);
			die('Bad Request');
		}
		http_response_code(201);
		echo json_decode($this->connection->lastInsertId());
	}

	public function action_delete($key)
	{
		if (empty($key)) {
			http_response_code(404);
			die('Not found task');
		}

		$sql = $this->connection->prepare("DELETE FROM tasks WHERE id = ?;");
		$result = $sql->execute([$key]);
		if ( ! $result) {
			http_response_code(404);
			die();
		}

		foreach ($this->connection->query("select * from tasks WHERE parent_id=$key", PDO::FETCH_ASSOC)->fetchAll() as $child_row) {
			$this->action_delete($child_row[id]);

		}
		echo 'sucsess';
	}

	public function __destruct() {
		if (self::$db) {
			self::$db = null;
		}
	}
}

