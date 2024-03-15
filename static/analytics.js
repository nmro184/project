function addErrands(start, end) {
  var list = document.getElementById('errands-list');
  
  // Call getErrands to fetch errands data
  getErrands(start, end)
      .then(errandsList => {
          // Iterate over the fetched errandsList and append to the errands-list element
          errandsList.forEach(errand => {
              var errandli = document.createElement('li');
              errandli.textContent = errand;
              list.appendChild(errandli);
          });
      })
      .catch(error => {
          console.error('Error fetching or adding errands:', error);
          // Handle error as needed
      });
}


function getErrands(start, end) {
  return fetch(`/errands/${start}/${end}/${username}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch errands');
          }
          return response.json(); // Parse the JSON data in the response
      })
      .catch(error => {
          console.error('Error fetching errands:', error);
          throw error; // Propagate the error to the caller
      });
}
function addHabits(start, end) {
  var list = document.getElementById('habits-list');
  var habit_title_list = []
  var new_habits_list = []
  
  // Call getHabits to fetch habits data
  getHabits(start, end)
      .then(habitsList => {
          // Iterate over the fetched habitsList and append to the habits-list element
          habitsList.forEach(habit => {
               if(!habit_title_list.includes(habit.title)){
                  habit_title_list.push(habit.title);
                  new_habits_list.push({
                    'title' : habit.title , 
                    'done' : habit.done,
                    'total' : 1
                  });
              } else {
                // Find the index of the habit in new_habits_list
                const index = new_habits_list.findIndex(item => item.title === habit.title);
            
                // If the habit is found, update its properties
                if (index !== -1) {
                    new_habits_list[index].done += habit.done;
                    new_habits_list[index].total += 1;
                }
            }
          });

          // Append habitDiv elements to the DOM after processing habitsList
          for(var i = 0 ; i < new_habits_list.length ; i++){
            var habitDiv = document.createElement('div');
            var progressDiv = document.createElement('div');
            habitDiv.textContent = new_habits_list[i].title; // Accessing title property
            habitDiv.className = 'habit-div'
            progressDiv.textContent = `${new_habits_list[i].done}/${new_habits_list[i].total}`; // Generating total string
            progressDiv.className = 'progress'
            habitDiv.appendChild(progressDiv ); // Appending total as text content
            list.appendChild(habitDiv);
          }
      })
      .catch(error => {
          console.error('Error fetching or adding habits:', error);
          // Handle error as needed
      });
}



function getHabits(start, end) {
  return fetch(`/habits/${start}/${end}/${username}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch habits');
          }
          return response.json(); // Parse the JSON data in the response
      })
      .catch(error => {
          console.error('Error fetching habits:', error);
          throw error; // Propagate the error to the caller
      });
}

function backHome(){

  window.location.href = `/home/${username}`;
}