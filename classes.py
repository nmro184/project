import json
class Task:
    name : str
    duedate : str
    
    def __init__(self , task_tuple):
        self.id = task_tuple[0]
        self.type = task_tuple[1]
        self.title = task_tuple[2]
        self.start = task_tuple[3]
        self.end = task_tuple[4]
        if task_tuple[5] is None or task_tuple[5] == "":
            self.recurrence = ''   
        else:
           self.recurrence = json.loads(task_tuple[5])
        self.done = task_tuple[6]
        self.username = task_tuple[7]
    
    def __str__(self):
        return f"{self.name}{self.duedate}{self.hour}"

    def to_dict(self):
        return {
            'id' : self.id,
            'type' : self.type,
            'title': self.title,
            'start': self.start,
            'end' : self.end,
            'recurrence' : self.recurrence ,
            'done' : self.done,
            'username' : self.username
        }
class User:
    def __init__(self , user_tuple):
        self.id =  user_tuple[0]
        self.name = user_tuple[1]
        self.username = user_tuple[2]
        self.password = user_tuple[3]
        self.email = user_tuple[4]
        self.phone = user_tuple[5]
    
    def to_dict(self):
        return {
            'id' : self.id,
            'name' : self.name,
            'username': self.username,
            'email': self.email,
            'phone' : self.phone,
        }
       
