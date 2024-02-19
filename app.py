from flask import Flask , render_template ,  redirect , request , jsonify
from datetime import datetime
from classes import Week 
from db import new_task , get_tasks , delete_task , done_task , get_task
import json
app = Flask(__name__)

tasks = []
@app.route('/')
def login():
    return render_template("login.html")


# the /home route is used to showing all existing tasks mean while allowing to create , delete , edit tasks and to see past tasks
@app.route('/home/<username>' , methods = ['POST' , 'GET'])
def home(username):
    return render_template("home.html" , tasks = get_tasks(username) , username = username)

#the route /create is used for entring a new task into the DB
@app.route('/create/<username>' , methods = ['POST' , 'GET'])
def create(username):
    duedate_str = request.args['duedate']
    duedate = datetime.strptime(duedate_str, '%Y-%m-%d')
    day_of_week = duedate.strftime('%A')
    new_task(name = request.args['name'] , duedate=request.args['duedate'] , day = day_of_week , username = username )
    return redirect(f"/home/{username}")

@app.route('/week')
def week():
    tasks_list = get_tasks()
    week_instance = Week(tasks_list)
    return render_template('week.html',week = json.dumps(week_instance.to_dict()))

@app.route('/delete/<username>' , methods = ['POST', 'GET'])
def delete(username):
    delete_task(request.args['deleteid'])
    return redirect(f"/home/{username}")

@app.route('/done/<task_id>')
def done(task_id):
    done_task(task_id)
    return home()

@app.route('/api/task/<task_id>')
def get_task_api(task_id):
    task = get_task(task_id)
    return jsonify(task.to_dict())
