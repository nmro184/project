import sqlite3
from classes import Task , User
DB_NAME = "tasks.db"
FALSE = 0
def query(sql: str = "", data: tuple = ()):
    with sqlite3.connect(DB_NAME) as conn:
        cur = conn.cursor()
        return cur.execute(sql, data).fetchall()

def new_task(type ,title, username , start  = "", end = ""):
    data = (type, title, start ,end , FALSE , username )
    query("INSERT INTO tasks (type, title, start , end, done , username) VALUES (?,?, ? ,? , ? , ?)", data)

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

def sign_up(name , username , password , email , phone):
    data = (name , username , password , email , phone)
    users_list = get_users()
    for user in users_list:
        if (user.username == username):
            return "select a different username , this one is already used"
        if (user.email == email):
            return "this email is linked to another account"
        if (user.phone == phone):
            return "this phone number is linked to another account"
        
    query("INSERT INTO users (name, username , password, email , phone) VALUES (?, ? ,? , ? , ?)", data)
    return "signed up succesfully"

def get_users():
    users_list =[]
    users_tuple_list = query("SELECT * FROM users ")
    for user in users_tuple_list:
       users_list.append(User(user))
    return users_list
