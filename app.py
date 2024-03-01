from flask import Flask , render_template ,  redirect , request , jsonify , flash , session
from datetime import datetime
from db import new_task , get_tasks , delete_task , done_task , get_task , edit_task , sign_up , get_users
import json
app = Flask(__name__)

app.secret_key = 'jhckcvucuygvuyvouyublyiuvoyuycfdutd'

tasks = []
@app.route('/')
def login():
    message = None
    if 'message' in session:
        message = session['message']
        del session['message']  # Remove the message from the session after displaying it
    return render_template("login.html", message=message)

@app.route('/login' , methods = ["POST"])
def validate_login():
    valid = False
    username = request.form['username']
    password = request.form['password']
    users_list = get_users()
    for user in users_list:
        if (user.username == username):
            if (user.password == password):
                valid = True
    if(valid):
        return redirect(f"/home/{username}")
    else:
        session["message"] = "wrong username or password"
        return redirect("/")
    
# the /home route is used to showing all existing tasks mean while allowing to create , delete , edit tasks and to see past tasks
@app.route('/home/<username>' , methods = ['POST' , 'GET'])
def home(username):
    return render_template("home.html" , tasks = get_tasks(username) , username = username)

#the route /create is used for entring a new task into the DB
@app.route('/create/<username>' , methods = ['POST' , 'GET'])
def create(username):
    if request.args['type'] == "errand":
        new_task(type = 'errand', title = request.args['title'] , username = username)
        return redirect(f"/home/{username}")
    else:
        new_task(request.args['type'], title = request.args['title'] ,start = request.args['start'] , end = request.args['end'], username = username )
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

@app.route('/update/<username>', methods=['POST'])
def update(username):
    data = request.json
    edit_task(task_id=data['id'], title=data['title'], start=data['start'], end=data['end'])
    return redirect(f"/home/{username}")

@app.route('/signup' , methods=['POST'])
def signup():
    session['message'] = sign_up(name = request.form['name'] , email = request.form['email'] , phone = request.form['phone'] , username = request.form['username'] , password = request.form['password'])
    return redirect("/")