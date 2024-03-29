import sqlite3
import uuid
import json
from classes import Task , User
from datetime import datetime , timedelta
DB_NAME = "tasks.db"
FALSE = 0
def query(sql: str = "", data: tuple = ()):
    with sqlite3.connect(DB_NAME) as conn:
        cur = conn.cursor()
        return cur.execute(sql, data).fetchall()

def new_task(type ,title ,username, start  = "", end = "", recurrence="" ):
    data = (type, title, start ,end ,recurrence, FALSE , username )
    query("INSERT INTO tasks (type , title , start , end , recurrence , done , username) VALUES (? , ? , ? , ? , ? , ? , ?)", data)

def get_tasks(username):
    task_tuple_list = query(f"SELECT * FROM tasks WHERE username = '{username}'")
    return [Task(task) for task in task_tuple_list]

def delete_task(id):
    query(f"DELETE from tasks WHERE id ={id}")

def done_task(task_id):
    query(f"UPDATE tasks SET done = 1 WHERE id = {task_id}")

def done_errand(task_id):
    now = datetime.now()

    # Format the datetime as a string in the desired format
    formatted_now = now.strftime('%Y-%m-%dT%H:%M')

    # Assuming query is a function to execute SQL queries
    query(f"UPDATE tasks SET done = 1, end = '{formatted_now}' WHERE id = {task_id}")

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

def new_recurreing_task(type , title ,start , end , recurrence , username):
    current_date = datetime.strptime(start, '%Y-%m-%dT%H:%M')
    current_end_date = datetime.strptime(end, '%Y-%m-%dT%H:%M')
    end_date = datetime.strptime(recurrence['until'], '%Y-%m-%d')
    days_to_recur = recurrence['daysOfWeek']
    recurrence['group_id'] = generate_unique_group_id()
    while (current_date <= end_date):
        week_day = current_date.weekday() +1
        if (week_day == 7 ):
            week_day = 0
        if str(week_day) in days_to_recur:
            current_start = current_date.strftime('%Y-%m-%dT%H:%M')
            current_end = current_end_date.strftime('%Y-%m-%dT%H:%M')
            data = (type, title, current_start ,current_end ,json.dumps(recurrence), FALSE , username )
            query("INSERT INTO tasks (type , title , start , end , recurrence , done , username) VALUES (? , ? , ? , ? , ? , ? , ?)", data)
        current_date += timedelta(days=1)
        current_end_date += timedelta(days=1)
    return


import uuid  # For generating unique IDs

def generate_unique_group_id():
    while True:
        # Generate a new UUID (unique ID)
        group_id = str(uuid.uuid4())
        
        # Check if the generated ID already exists in any task's recurrence attribute
        result = query("SELECT COUNT(*) FROM tasks WHERE recurrence LIKE ?", ('%"group_id": "{}"%'.format(group_id),))
        if result[0][0] == 0:
            return group_id

def edit_recurring_task(task_id , title , start , end , recurrence , alltasks , startDiff , endDiff):
    if(alltasks):
        results = query("SELECT * FROM tasks WHERE recurrence LIKE ?", ('%"group_id": "{}"%'.format(recurrence),))
        for result in results:
            new_start = add_hours(result[3] , startDiff)
            new_end = add_hours(result[4] , endDiff)
            data = (new_start , new_end , result[0])
            query("UPDATE tasks SET  start =? , end = ? WHERE id = ?" , data)
    else:
        data = (title , start , end , task_id )
        query("UPDATE tasks SET title = ? , start =? , end = ? WHERE id = ?" , data)
    return

def add_hours(date_string, hours_to_add):
    date_obj = datetime.strptime(date_string, '%Y-%m-%dT%H:%M')
    modified_date = date_obj + timedelta(hours=hours_to_add)
    modified_date_string = modified_date.strftime('%Y-%m-%dT%H:%M')

    return modified_date_string

def get_errands(username):
    data = ( 'errand' , username)
    return query(f"SELECT * FROM tasks WHERE type = ? AND username = ?" , data)

def get_habits(start , end , username):
    data = (start, end, 'habit' , username)
    return query(f"SELECT * FROM tasks WHERE start > ? AND start < ? AND type = ? AND username = ?" , data)

def send_friend_request(sent_by , sent_to):
    data = (sent_by , sent_to , 'pending')
    query("INSERT INTO friend_requests (sent_by , sent_to , status) VALUES (? , ? , ?)", data)
    return "friend request sent!"

def get_friend_requests(username):
    data = (username , "pending")
    friend_requests = query("SELECT * FROM friend_requests WHERE sent_to = ? AND status = ?",data )
    return friend_requests

def get_id_by_username(username):
    data = (username,)
    id = query("SELECT id FROM users WHERE username = ? ",data )
    return id[0][0]

def accept(sent_by,sent_to):
    data = ('accepted' , sent_by , sent_to)
    query("UPDATE friend_requests SET status = ? WHERE sent_by = ? AND sent_to = ? AND status = 'pending'" , data)
    data = (sent_by , sent_to)
    query(f"INSERT INTO friends (user1 , user2) VALUES (?,?)" , data)
    return 'lolo'

def deny(sent_by,sent_to):
    data = ('denied' , sent_by , sent_to)
    query(f"UPDATE friend_requests SET status = ? WHERE sent_by = ? AND sent_to = ? AND status = 'pending'" , data)
    return 'lolo'

def friends(user1, user2):
    data = (user1, user2)
    flag = False
    friendship = query("SELECT * FROM friend_requests WHERE (sent_by = ? AND sent_to = ? OR sent_by = ? AND sent_to = ?) AND (status = 'pending' OR status = 'accepted')", (data[1], data[0], data[0], data[1]))
    if friendship:
        flag = True
    return flag

def get_friends(username):
    return query("SELECT CASE WHEN user1 = ? THEN user2 WHEN user2 = ? THEN user1 END FROM friends" , (username , username))

   