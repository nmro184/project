import requests
base_url = "http://127.0.0.1:5000/"

username = "tal"
def test_create():
    response =  requests.get(url =base_url+f'create/{username}?title=test&type=errand&recurrence-flag=off')
    assert(response)

def test_get_errands_py():
    response = requests.get(url =base_url+f'errands/2024-03-22T18:27/end/{username}')
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_get_habits_py():
    response = requests.get(url = base_url+f'/habits/2024-03-20T18:27/2024-04-24T18:27/{username}')
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_get_users_py():
    response = requests.get(url = base_url+'/get_users')
    assert response.status_code == 200
    assert len(response.json()) == 5

def test_get_tasks_py():
    response = requests.get(url = base_url+f'/api/tasks/{username}')
    assert response.status_code == 200
    assert len(response.json()) == 2