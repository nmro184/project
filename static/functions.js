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