from flask import Flask , render_template ,  redirect , request , jsonify  , session
from datetime import datetime
from db import new_task , get_tasks , delete_task , done_task , get_task , edit_task , sign_up , get_users , new_recurreing_task , edit_recurring_task , get_errands , get_habits
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
    recurrence = None
    if(request.args['recurrence-flag'] == 'on'):
        recurrence = {
            'daysOfWeek' : request.args.getlist('daysOfWeek'),
            'until' : request.args['end-recurrence']
        }
        new_recurreing_task(type = request.args['type'] , title = request.args['title'] ,start = request.args['start'] , end = request.args['end'],recurrence = recurrence, username = username)
        return redirect(f"/home/{username}")
    
    if request.args['type'] == "errand":
        start = datetime.now().strftime('%Y-%m-%dT%H:%M')
        new_task(type = 'errand', title = request.args['title'] , username = username , start = start )
        return redirect(f"/home/{username}")
    else:
        new_task(request.args['type'], title = request.args['title'] ,start = request.args['start'] , end = request.args['end'],recurrence = recurrence, username = username )
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
    if data.get('recurrence') is not None:
        alltasks =data['alltasks']
        if alltasks:
            edit_recurring_task(task_id=data['id'], title=data['title'], start=data['start'], end=data['end'], recurrence =data['recurrence'] , alltasks = alltasks , startDiff = data['startDiff'],endDiff = data['endDiff'] )
        else:
            edit_recurring_task(task_id=data['id'], title=data['title'], start=data['start'], end=data['end'], recurrence =data['recurrence'] , alltasks = alltasks ,startDiff = '' , endDiff = ''  )
        return redirect(f"/home/{username}")
    else:
        edit_task(task_id=data['id'], title=data['title'], start=data['start'], end=data['end'])
        return redirect(f"/home/{username}")

@app.route('/signup' , methods=['POST'])
def signup():
    session['message'] = sign_up(name = request.form['name'] , email = request.form['email'] , phone = request.form['phone'] , username = request.form['username'] , password = request.form['password'])
    return redirect("/")

@app.route('/analytics')
def analytics():
    return render_template("week.html", username = "nimrof")

@app.route('/data')
def data():
    start = request.args['start']
    end = request.args['end']
    username = request.args['username']
    return render_template('data.html' , start = start , end = end , username =username)

@app.route('/errands/<start>/<end>/<username>')
def errands(start , end , username):
    errands_list = get_errands(start , end , username)
    title_list = []
    for errand in errands_list:
        title_list.append(errand[2])
    return title_list

@app.route('/habits/<start>/<end>/<username>')
def habits(start , end , username):
    habits_tuple_list = get_habits(start , end , username)
    habit_list = []
    for habit in habits_tuple_list:
        habit_dict = {
            'id': habit[0],
            'type' : habit[1],
            'title' : habit[2],
            'start' : habit[3],
            'end' : habit[4],
            'recurrence' : habit[5],
            'done' : habit[6],
            'username' : habit[7]
        }
        habit_list.append(habit_dict)
    return habit_list
@app.route('/get_users')
def Users():
    users_list = get_users()
    users_dict_list = []
    for user in users_list:
        users_dict_list.append(user.to_dict())
    return jsonify(users_dict_list)
