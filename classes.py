class Task:
    name : str
    duedate : str
    
    def __init__(self , task_tuple):
        self.id = task_tuple[0]
        self.name = task_tuple[1]
        self.duedate = task_tuple[2]
        self.day = task_tuple[3]
        self.done = task_tuple[4]
    
    def __str__(self):
        return f"{self.name}{self.duedate}{self.hour}"

    def to_dict(self):
        return {
            'name': self.name,
            'duedate': self.duedate,
            'day' : self.day,
            'done' : self.done
        }

