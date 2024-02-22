from flask import Flask , render_template ,  redirect , request , jsonify
from datetime import datetime
from db import new_task , get_tasks , delete_task , done_task , get_task , edit_task
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
    new_task(title = request.args['title'] ,start = request.args['start'] , end = request.args['end'], username = username )
    return redirect(f"/home/{username}")

@app.route('/delete/<username>/<id>' , methods = ['POST', 'GET'])
def delete(username , id):
    delete_task(id)
    return redirect(f"/home/{username}")

@app.route('/done/<task_id>/<username>')
def done(task_id , username):
    done_task(task_id)
    return redirect(f"/home/{username}")

@app.route('/api/task/<task_id>')
def get_task_api(task_id):
    task = get_task(task_id)
    j_task = task.to_dict()
    return jsonify(j_task)

@app.route('/api/tasks/<username>')
def json_tasks(username):
    json_tasks = []
    for task in get_tasks(username):
        json_tasks.append((task.to_dict()))
    return jsonify(json_tasks)

@app.route('/edit/<username>')
def edit(username):
    edit_task(task_id = request.args['id'] ,title = request.args['title'] , start = request.args['start'], end = request.args['end'] )
    return redirect(f"/home/{username}")