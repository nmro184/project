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

class Week:
    weeknum: int
    dates: str
    Tasks: list
    hours: list

    def __init__(self, tasks):
        self.weeknum = 0
        self.dates = ""
        self.tasks = self.sort(tasks)
        self.hours = self.create_hours()

    @classmethod
    def sort(cls, tasks: list):
        a = sorted(tasks, key=lambda task: task.hour)
        return sorted(tasks, key=lambda task: task.hour)
    
    def generate_hour_range(self, start_hour, end_hour):
        start_hour_int = int(start_hour.split(':')[0])
        end_hour_int = int(end_hour.split(':')[0])
        hour_range = [f"{hour:02d}:00" for hour in range(start_hour_int, end_hour_int + 1)]
        return hour_range

    def create_hours(self):
        start_hour = self.tasks[0].hour
        end_hour = self.tasks[-1].hour
        return self.generate_hour_range(start_hour, end_hour)


    def __str__(self):
        return f"{self.weeknum} {self.dates} {self.Tasks}"
    
    def to_dict(self):
        return {
            'weeknum': self.weeknum,
            'dates': self.dates,
            'tasks': [task.to_dict() for task in self.tasks],
            'hours': self.hours
        }
    