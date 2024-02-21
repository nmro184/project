class Task:
    name : str
    duedate : str
    
    def __init__(self , task_tuple):
        self.id = task_tuple[0]
        self.title = task_tuple[1]
        self.start = task_tuple[2]
        self.end = task_tuple[3]
        self.done = task_tuple[4]
        self.username = task_tuple[5]
    
    def __str__(self):
        return f"{self.name}{self.duedate}{self.hour}"

    def to_dict(self):
        return {
            'title': self.title,
            'start': self.start,
            'end' : self.end,
            'done' : self.done,
            'username' : self.username
        }

