// Get the input element
var input = document.getElementById('courses');
var enableButton = document.getElementById('toggle');
// Check if there's a saved value in localStorage
chrome.storage.local.get("courses", function(result) {
    if(result.courses !== undefined) {
        // Set the value of the input to the saved value
        input.value = result.courses;
    } else {
        chrome.storage.local.set({courses: ''})
    }
})

chrome.storage.local.get("enabled", function(result) {
    if (!result) {
        chrome.storage.local.set({enabled: false})
    }
})


// Add an event listener for changes in the input's value
input.addEventListener('input', function() {
  // Save the value in localStorage
  console.log(input.value)
  chrome.storage.local.set({courses: input.value})
});

enableButton.addEventListener('click', function() {
    chrome.storage.local.get("enabled", function(result) {
        if(result.enabled) {
            chrome.storage.local.set({enabled: false})
        } else {
            chrome.storage.local.set({enabled: true})
        }
    })
})