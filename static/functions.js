var calender;
    document.addEventListener('DOMContentLoaded', function() {
        
        var calendarEl = document.getElementById('calendar');
        calendarEl.id = 'myCalendar'; // Assign id attribute
        calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek', // Change to weekly view
        // Set the date range to the current week
        editable: true, // Enable drag-and-drop
        eventDrop: function(info) {
            // When an event is dropped (i.e., its location is changed)
            // You can access the event information from the 'info' object
            var title = info.event.title;
            var eventId = info.event.id; // Get the event ID
            var newStart = info.event.start; // Get the new start date/time
            var newEnd = info.event.end; // Get the new end date/time
            var recurrence = info.event.extendedProps.recurrence_id;
            var utcStart = formatDate(newStart);
            var utcEnd = formatDate(newEnd);
            
            var payload = {
                id: eventId,
                title: title,
                start: utcStart,
                end: utcEnd,
                recurrence : recurrence
            };
            if (recurrence !== undefined){
                var confirmEditAll = confirm("Do you want to edit all the instances of that event?");
                payload.alltasks = confirmEditAll
                if (confirmEditAll){
                    var oldStart = info.oldEvent.start;
                    var oldEnd = info.oldEvent.end;
                    var startTimeDifference = newStart.getTime() - oldStart.getTime(); // in milliseconds
                    var startHoursDifference = startTimeDifference / (1000 * 60 * 60);
                    var endTimeDifference = newEnd.getTime() - oldEnd.getTime(); // in milliseconds
                    var endHoursDifference = endTimeDifference / (1000 * 60 * 60);
                    payload.startDiff = startHoursDifference;
                    payload.endDiff = endHoursDifference;
                }
            } 
            
            
            fetch(`/update/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.error('Error:', error);
            });
            
        },
        eventDidMount: function(info) {
            // Get the clicked event object
            var event = info.event;

            // Create an option bar above the clicked event
            var optionBar = document.createElement('div');
            optionBar.className = 'option-bar';
            optionBar.id = `optionBar${event.id}`
            
            // Create buttons for different actions
            var editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function() {
                // Call a function to handle edit action
                toggleEdit(event.id);
            });
            optionBar.appendChild(editButton);

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                // Call a function to handle delete action
                deleteTask(event.id);
            });
            optionBar.appendChild(deleteButton);
            
            var doneButton = document.createElement('button');
            doneButton.textContent = 'Done';
            doneButton.addEventListener('click', function() {
                // Call a function to handle done action
                doneTask(event.id , 'habit');
            });
            optionBar.appendChild(doneButton);
            // Add the option bar above the clicked event
            var eventElement = info.el;
            optionBar.style.display = 'none';
            eventElement.appendChild(optionBar);

        },
        eventClick:function(info){
            optionBar = document.getElementById(`optionBar${info.event.id}`);
            if (optionBar.style.display == 'none'){
                optionBar.style.display = 'inline-block';
            }else{
                optionBar.style.display = 'none';
            }
        },


        eventOverlap: false, // Prevent events from overlapping
        initialDate: new Date(), // Start from today
        nowIndicator: true, // Show current time indicator
        events: [],
        weekNumbers: true,
        scrollTime: '09:00',
        slotMinTime: '06:00:00', // Set the earliest visible time (e.g., 8 AM)
        slotMaxTime: '24:00:00', // Set the latest visible time (e.g., 6 PM)
        viewDidMount: function(view) {
            calendar.getEvents().forEach(function(event) {
                event.remove();
            });

            addEvents();
            addFriends();
        },
        headerToolbar: {
            left: 'prev,next today', // Add buttons for previous, next, and today
            center: 'weekRecapButton', // Add title to the center
            right: 'dayGridMonth,timeGridWeek,timeGridDay' // Add buttons for different views
        },
        customButtons: {
            weekRecapButton: {
                text: 'Recap',
                click: function() {
                    var weekRecapButton = document.querySelector('.fc-weekRecapButton-button');
                    var start = weekRecapButton.dataset.start;
                    var end = weekRecapButton.dataset.end;
                    // Construct the URL with query parameters
                    var url = `/data?start=${start}&end=${end}&username=${username}`;

                    // Navigate to the new page
                    window.location.href = url;
                },
                
            }
        },
        datesSet: function(info) {
            var weekRecapButton = document.querySelector('.fc-weekRecapButton-button');
            weekRecapButton.dataset.start = formatDate(info.start);
            weekRecapButton.dataset.end = formatDate(info.end);
        },
          
        eventColor: 'black'
        
        });
        calendar.render();
        addErrands();
        
    });
function togglerecurrence(event){
    event.preventDefault()
    console.log('lalala')
    form = document.getElementById("recurrenceForm");
    flag = document.getElementById('recurrence-flag');
    if (form.style.display == 'none'){
        form.style.display = 'block'
        flag.value = 'on'

    }else{
        form.style.display = 'none'
        flag.value = 'off'
    }
}
function toggleCreate(event , type){
    event.preventDefault();
    form = document.getElementById("createForm");
    typeInput = document.getElementById("type-input");
    typeInput.value = type
    
    var errandButton = document.getElementById('errand-button');
    var routineButton = document.getElementById('routine-button');
    var habitButton = document.getElementById('habit-button');
    var startInput = document.getElementById("start-time-input");
    var endInput = document.getElementById("end-time-input");
    var checkboxes = document.getElementsByClassName('day-checkbox');
    var daysLabel = document.getElementById('days-label');
    if(type == 'errand'){
        startInput.style.display = "none";
        endInput.style.display = "none";
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].style.display = 'none';
        }
        daysLabel.style.display = 'none';
        errandButton.className = 'pressed';
        routineButton.className = 'form-type';
        habitButton.className = 'form-type';
       
    }else{
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].style.display = 'block';
        }
        daysLabel.style.display = 'block';
        startInput.style.display = "block";
        endInput.style.display = "block";
        if (type == 'routine'){
            errandButton.className = 'form-type';
            routineButton.className = 'pressed';
            habitButton.className = 'form-type';
        }else{
            errandButton.className = 'form-type';
            routineButton.className = 'form-type';
            habitButton.className = 'pressed';
        }
    }
}
function formatDate(dateString) {
    // Parse the date string into a Date object
    var date = new Date(dateString);

    // Extract date components
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
    var day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
    var hours = ('0' + date.getHours()).slice(-2); // Add leading zero if needed
    var minutes = ('0' + date.getMinutes()).slice(-2); // Add leading zero if needed

    // Construct the formatted date string
    var formattedDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

    return formattedDate;
}
function deleteTask(task_id){
    fetch(`/delete/${username}/${task_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        location.reload();
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}
function getTasks() {
    return fetch(`/api/tasks/${username}`)
        .then(response => response.json())
        .then(tasks => { 
            var events = tasks.map(task => ({
                title: task.title,
                type : task.type,
                start: task.start,
                end: task.end,
                done : task.done,
                recurrence : task.recurrence,
                id : task.id,
            }));
            return events;
        })
        .catch(error => {
            console.error('Error fetching task details:', error);
            throw error; // Propagate the error to the caller
        });
}
function addEvent(id ,title, start, end ,done, recurrence) {
    // Create a new event object
  var newEvent = {
      title: title,
      start: start,
      end: end,
      id : id 
    }
    if (recurrence != ''){
      newEvent.recurrence_id = recurrence.group_id
    }
    if (done == 1) {
        newEvent.color = 'purple'; // Set the color property dynamically
    }

    var addedEvent = calendar.addEvent(newEvent);
  return addedEvent;
}
function addEvents() {
  getTasks()
      .then(tasks => {
          tasks.map(task =>{
              if (task.type !== "errand") {
                  addEvent(id = task.id, title = task.title, start = task.start, end = task.end , done = task.done, recurrence = task.recurrence);
              }
          })
      })
      .catch(error => console.error('Error fetching tasks:', error));
}
function toggleForm() {
    var form = document.getElementById("createForm");
    if (form.style.display == "block"){
        form.style.display = "none"
    }
    else{
        form.style.display = "block"
    }
}

function doneTask(task_id , type) {
    
    fetch(`/done/${task_id}/${type}/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
        if (type == "habit"){
            var habit = calendar.getEventById(task_id);
            habit.setProp('color', 'purple');
        }
}
function toggleEdit(id){
    var editForm = document.getElementById("editform");
    if(editForm.style.display == "none"){
        editForm.style.display = "block";
                fetch(`/api/task/${id}`)
                    .then(response => response.json())
                    .then (task => {
                        if(task.type === 'errand'){
                            editForm.elements['title'].value = task.title;
                            editForm.elements['id'].value = id;
                            editForm.elements['start'].style.display = 'none';
                            editForm.elements['end'].style.display = 'none';
                        }else{
                            editForm.elements['start'].style.display = 'block';
                            editForm.elements['end'].style.display = 'block';
                            editForm.elements['title'].value = task.title;
                            editForm.elements['start'].value = task.start;
                            editForm.elements['end'].value = task.end;
                            editForm.elements['id'].value = id;
                        }
                        
                    })
                    .catch(error => console.error('Error fetching task details:', error));  
                }
                else{
                    editForm.style.display = "none";
                }
                   
}
function toggleOptions(id){
    deleteButton = document.getElementById(`delete${id}`);
    editButton = document.getElementById(`edit${id}`);
    doneButton = document.getElementById(`done${id}`)
    if (deleteButton.style.display == 'inline-block'){
        deleteButton.style.display = 'none'
        editButton.style.display = 'none'
        doneButton.style.display = 'none'
    }else{
        deleteButton.style.display = 'inline-block'
        editButton.style.display = 'inline-block'
        doneButton.style.display = 'inline-block'
    }

    
}
function addErrand(task) {
    var listItem = document.createElement("li");
    listItem.textContent = task.title;
    listItem.onclick = function() {
        toggleOptions(task.id); // Call toggleOptions with task id
    };
    listItem.className = 'option-bar2';
    listItem.id = `Item${task.id}`

    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = function() {
        toggleEdit(task.id); // Call toggleOptions with task id
    };
    editButton.id = `edit${task.id}`
    editButton.style.display = 'none'
    listItem.appendChild(editButton);

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        deleteTask(task.id); // Call deleteTask with task id
    };
    deleteButton.id = `delete${task.id}`
    deleteButton.style.display ='none'
    listItem.appendChild(deleteButton);

    var doneButton = document.createElement('button');
    doneButton.textContent = 'Done';
    doneButton.onclick = function() {
        doneTask(task.id , 'errand'); // Call deleteTask with task id
    };
    doneButton.id = `done${task.id}`
    doneButton.style.display ='none'
    listItem.appendChild(doneButton);

    document.getElementById("taskList").appendChild(listItem);
}

function addErrands() {
    getTasks()
        .then(tasks => {
            tasks.map(task =>{
                if (task.type === "errand" && task.done !== 1) {
                    addErrand(task);
                }
            })
        })
        .catch(error => console.error('Error fetching tasks:', error));
  }

  function updateEndTime(value) {
    // Set the value of the end input field to the value of the start input field
    document.getElementById("end-time-input").value = value;
}
function toggleFriendSearch(){
    search = document.getElementById("search-bar");
    if (search.style.visibility === 'hidden') {
        search.style.visibility = 'visible';
    } else {
        search.style.visibility = 'hidden';
    }

}

function searchFriends(value){
    if (value.trim() === ""){
        var userListElement = document.getElementById('friend-list');
        userListElement.innerHTML = ''; // Clear previous results
        return;
    }
    fetch('/get_users')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(users => {
        // Handle the response data (list of users)
        var searchedList = users.filter(function(user) {
            return user.name.toLowerCase().includes(value.toLowerCase());
        });
        displayUsers(searchedList , username)
    })
    .catch(error => {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
    });

}
    function displayUsers(users , username) {
        var userListElement = document.getElementById('friend-list');
        userListElement.innerHTML = ''; // Clear previous results
    
        // Create list items for each user and append them to the list
        users.forEach(function(user) {
            if(user.username !== username ){
                var listItem = document.createElement('li');
                listItem.textContent = user.username;
                listItem.onclick = function(){
                    sendFriendRequest(user.username)
                }
            
            userListElement.appendChild(listItem);
            }
        });
    
}

function sendFriendRequest(friend){
    console.log("dada")
    return fetch(`/frequest/${username}/${friend}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}
function notiflicationList(username){
    var list = document.getElementById("notiflication-list");
    list.style.display = "block";
    list.innerHTML = '';
    clearButton = document.createElement('button');
    clearButton.onclick =function(){ 
        closeList();
    }
    clearButton.className = 'clear-button';
    //var clearButtonIcon = document.createElement('i');
    //clearButtonIcon.className = 'clear-button-icon';
    //clearButtonIcon.textContent = 'x'; 
    // Create SVG element for clear button icon
    var clearButtonIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    clearButtonIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clearButtonIcon.setAttribute('fill', 'currentColor');
    clearButtonIcon.setAttribute('viewBox', '0 0 24 24');
    clearButtonIcon.setAttribute('width', '24');
    clearButtonIcon.setAttribute('height', '24');
    clearButtonIcon.innerHTML = '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>';

    clearButton.appendChild(clearButtonIcon);

    list.appendChild(clearButton);
    fetch(`/get_friend_requests/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(requests => {
            requests.forEach(request =>{
                var requestli= document.createElement('li');
                requestli.textContent = request.sent_by;
                requestli.className = 'friend-request';
                var buttonsDiv = document.createElement('div');
                buttonsDiv.className = "friend-request-buttons-div"
                var acceptButton = document.createElement('button');
                acceptButton.textContent = "accept";
                acceptButton.className = "accept-button";
                acceptButton.onclick = function(){
                    accept(request.sent_by , request.sent_to);
                }
                var denyButton = document.createElement('button');
                denyButton.textContent = "deny";
                denyButton.className = "deny-button";
                denyButton.onclick = function(){
                    deny(request.sent_by , request.sent_to);
                }
                buttonsDiv.appendChild(acceptButton);
                buttonsDiv.appendChild(denyButton);
                requestli.appendChild(buttonsDiv)
                list.appendChild(requestli);


            });
            // Handle the response data (list of users)
            
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
            
        
}
function accept(sent_by , sent_to){
    fetch(`/accept/${sent_by}/${sent_to}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}
function deny(sent_by , sent_to){
    fetch(`/deny/${sent_by}/${sent_to}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
    
}
function closeList(){
    var notiflication = document.getElementById("notiflication-list");
    notiflication.style.display = "none";
}
function addFriends(){
    var friendsList = document.getElementById("friends-list")
    fetch(`/get_friends/${username}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(friends => {
        friends.forEach(friend =>{
            var friendli= document.createElement('li');
            friendli.textContent = friend.username;
            friendli.className = 'friendli';
            friendli.onclick = function(){
                console.log(friend.username);
            }
            friendsList.appendChild(friendli);
    
        });
    })

    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
        
    
}
