var calender;
    document.addEventListener('DOMContentLoaded', function() {
        
        var calendarEl = document.getElementById('calendar');
        calendarEl.id = 'myCalendar'; // Assign id attribute
        calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek', // Change to weekly view
        // Set the date range to the current week
        editable: false, // Enable drag-and-drop
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
                    var url = `/data?start=${start}&end=${end}&username=${username}&viewer=${viewer}`;

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
function addErrand(task) {
    var listItem = document.createElement("li");
    listItem.textContent = task.title;
    listItem.className = 'option-bar2';
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




