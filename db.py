import sqlite3
from classes import Task
DB_NAME = "tasks.db"
FALSE = 0
def query(sql: str = "", data: tuple = ()):
    with sqlite3.connect(DB_NAME) as conn:
        cur = conn.cursor()
        return cur.execute(sql, data).fetchall()

def new_task(title, username , start  = "", end = ""):
    data = (title, start ,end , FALSE , username )
    query("INSERT INTO tasks (title, start , end, done , username) VALUES (?, ? ,? , ? , ?)", data)

def get_tasks(username):
    task_tuple_list = query(f"SELECT * FROM tasks WHERE username = '{username}'")
    return [Task(task) for task in task_tuple_list]

def delete_task(id):
    query(f"DELETE from tasks WHERE id ={id}")

def done_task(task_id):
    query(f"UPDATE tasks SET done = 1 WHERE id = {task_id}")

def get_done_tasks():
     task_tuple_list = query("SELECT * FROM tasks WHERE done = 1 ")
     return [Task(task) for task in task_tuple_list]
def get_task(id):
    task_tuple = query(f"SELECT * from tasks WHERE id = {id}")
    return Task(task_tuple[0])

def edit_task(task_id , title , start , end):
    data = (title , start , end , task_id)
    query("UPDATE tasks SET title = ? , start =? , end = ? WHERE id = ?" , data)