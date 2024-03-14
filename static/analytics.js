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
function backHome(){

  window.location.href = `/home/${username}`;
}