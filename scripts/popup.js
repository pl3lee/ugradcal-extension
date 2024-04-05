// Get the input element
const input = document.getElementById('courses')
const enableButton = document.getElementById('toggle')
const statusSpan = document.getElementById('status')

// Check if there's a saved value in localStorage
chrome.storage.local.get("courses", function(result) {
    if(result.courses != undefined) {
        // Set the value of the input to the saved value
        if (result.courses.trim() === "") {
            input.value = ""
        } else {
            input.value = result.courses;
        }
        
    } else {
        chrome.storage.local.set({courses: ''})
    }
})

chrome.storage.local.get("enabled", function(result) {
    if (!result.enabled) {
        chrome.storage.local.set({enabled: false})
        statusSpan.style.color = 'red'
        statusSpan.innerText = 'Disabled'
    } else {
        statusSpan.style.color = 'green'
        statusSpan.innerText = 'Enabled'
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
            statusSpan.style.color = 'red'
            statusSpan.innerText = 'Disabled'
        } else {
            chrome.storage.local.set({enabled: true})
            statusSpan.style.color = 'green'
            statusSpan.innerText = 'Enabled'
        }
    })
})