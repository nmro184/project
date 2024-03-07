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
        eventOverlap: false, // Prevent events from overlapping
        initialDate: new Date(), // Start from today
        nowIndicator: true, // Show current time indicator
        events: [],
        scrollTime: '09:00',
        slotMinTime: '06:00:00', // Set the earliest visible time (e.g., 8 AM)
        slotMaxTime: '24:00:00', // Set the latest visible time (e.g., 6 PM)
        viewDidMount: function(view) {
            console.log('Calendar view is rendered');
            console.log('mkskskksks')
            console.log(calendar.getEvents());
            calendar.getEvents().forEach(function(event) {
                event.remove();
            });

            addEvents();
        },
        headerToolbar: {
            left: 'prev,next today', // Add buttons for previous, next, and today
            center: 'title', // Add title to the center
            right: 'dayGridMonth,timeGridWeek,timeGridDay' // Add buttons for different views
        },
        eventColor: 'black'
        
        });
        calendar.render();
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
    
    var startInput = document.getElementById("start-time-input");
    var endInput = document.getElementById("end-time-input");
    var checkboxes = document.getElementsByClassName('day-checkbox')
    var daysLabel = document.getElementById('days-label')
    if(type == 'errand'){
        startInput.style.display = "none"
        endInput.style.display = "none"
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].style.display = 'none';
        }
        daysLabel.style.display = 'none'
       
    }else{
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].style.display = 'block';
        }
        daysLabel.style.display = 'block';
        startInput.style.display = "block"
        endInput.style.display = "block"
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
                start: task.start,
                end: task.end,
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
function addEvent(id ,title, start, end , recurrence) {
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
  
    var addedEvent = calendar.addEvent(newEvent);
  return addedEvent;
}
function addEvents() {
  getTasks()
      .then(tasks => {
          tasks.map(task =>{
              if (task.type !== "errand") {
                  addEvent(id = task.id, title = task.title, start = task.start, end = task.end , recurrence = task.recurrence);
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

function done(task_id , username) {
    var task = document.getElementById(`task${task_id}`);
    task.style.opacity = "0.3";

    fetch(`/done/${task_id}/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Remove the task row from the DOM after a delay
            setTimeout (function(){
                console.log('Task marked as done successfully');
                task.remove();
            }, 3000); // 3000 milliseconds = 3 seconds
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
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

