let observerActive = true; // Global flag to control observer reactivity

// Define the observer with a callback that checks the flag
const observer = new MutationObserver(function(mutationsList) {
    if (!observerActive) return; // Ignore mutations if the observer is set to inactive
    observerActive = false; // Prevent immediate re-observation
    main().then(() => {
        observerActive = true; // Re-enable observer after processing
    });
});

// Define the options for observing mutations
const observerOptions = {
    childList: true, // Observe direct children additions or removals
    subtree: true, // Observe all descendant elements as well
};

// Start observing the document body
observer.observe(document.body, observerOptions);

async function main() {
    observerActive = false; // Temporarily disable observer to prevent reaction to DOM updates
    const {courses: storedCourses, enabled} = await chrome.storage.local.get(["courses", "enabled"]);
    const courses = storedCourses ? storedCourses.split(/[\n, ]+/).map(course => course.trim().toUpperCase()).filter(course => course !== "") : [];


    const courseTexts = Array.from(document.querySelectorAll('a'));
    courseTexts.forEach(courseText => {
        const isCourse = courses.includes(courseText.innerText.toUpperCase().replace(/\s/g, ''));
        if (enabled && isCourse) {
            if (!courseText.dataset.highlighted) {
                // Add checkbox and highlight if it's a listed course and not already processed
                addCheckboxAndHighlight(courseText);
            }
        } else {
            // Remove checkbox and clear highlight if not enabled or not a listed course
            clearHighlightAndRemoveCheckbox(courseText);
        }
    });

    observerActive = true; // Re-enable observer after DOM updates are done
}

function addCheckboxAndHighlight(courseText) {
    courseText.style.backgroundColor = 'lightgreen';
    courseText.dataset.highlighted = 'true';

    let checkbox = courseText.nextSibling;
    if (!checkbox || checkbox.type !== 'checkbox') {
        checkboxContainer = document.createElement('div');
        checkboxContainer.style.display = 'inline-flex';
        checkboxContainer.style.alignItems = 'center';
        checkboxContainer.style.justifyContent = 'center';
        checkboxContainer.style.marginRight = '5px';
        checkboxContainer.style.marginLeft = '5px';
        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.addEventListener('change', () => toggleHighlight(courseText, checkbox.checked));
        checkboxContainer.appendChild(checkbox);
        courseText.parentNode.insertBefore(checkboxContainer, courseText.nextSibling);
    }
}

function clearHighlightAndRemoveCheckbox(courseText) {
    if (courseText.dataset.highlighted) {
        courseText.style.backgroundColor = '';
        courseText.removeAttribute('data-highlighted');
        const checkbox = courseText.nextSibling;
        if (checkbox && checkbox.type === 'checkbox') {
            checkbox.parentNode.removeChild(checkbox);
        }
    }
}

function toggleHighlight(courseText, isChecked) {
    courseText.style.backgroundColor = isChecked ? 'lightgreen' : '';
    courseText.dataset.highlighted = isChecked ? 'true' : '';
}

// Initial setup and listener for storage changes
main();
chrome.storage.onChanged.addListener(() => {
    observerActive = false; // Ensure observer doesn't react to upcoming DOM changes
    main().finally(() => {
        observerActive = true; // Re-enable observer after changes
    });
});
