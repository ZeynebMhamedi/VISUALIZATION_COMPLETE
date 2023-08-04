window.onload = function() {
    localStorage.removeItem('selectedForest');
};

function openVis(evt, visName) {
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(visName).style.display = "block";
    evt.currentTarget.className += " active";
    
    // Remove existing visualization script if exists
    let oldScript = document.getElementById('vis-script');
    if (oldScript) {
        document.head.removeChild(oldScript);
    }

    // Create a new script tag
    let script = document.createElement('script');
    script.src = visName + '.js'; // Set source to appropriate JavaScript file
    script.id = 'vis-script'; // Set id so we can remove it later
    script.type = "module"; // Add the type of module
    script.onload = function() {
        // Listener for forest select change
        const forestSelect = document.getElementById('forestSelect');
        if (forestSelect) {
            forestSelect.addEventListener('change', async function(event) {
                const { value } = event.target;
    
                // Save the selection in localStorage
                localStorage.setItem('selectedForest', value);
    
                // Check which script is currently loaded
                let currentScript = document.getElementById('vis-script');
                if (currentScript) {
                    let scriptName = currentScript.src.split('/').pop().split('.')[0];
                    console.log(scriptName); // for debugging
    
                    // Run the appropriate function to load the forest
                    if (scriptName === 'Vis1') {
                        loadForestVis1(value);
                    } else if (scriptName === 'Vis2') {
                        loadForestVis2(value);
                    } else if (scriptName === 'Vis3') {
                        loadForestVis3(value);
                    }
                }
            });
    
            // Call the loadForest function immediately after the script is loaded
            let selectedForest = localStorage.getItem('selectedForest');
            if (selectedForest) {
                let scriptName = script.src.split('/').pop().split('.')[0];
                if (scriptName === 'Vis1' && typeof loadForestVis1 === 'function') {
                    loadForestVis1(selectedForest);
                } else if (scriptName === 'Vis2' && typeof loadForestVis2 === 'function') {
                    loadForestVis2(selectedForest);
                } else if (scriptName === 'Vis3' && typeof loadForestVis3 === 'function') {
                    loadForestVis3(selectedForest);
                }
            }
        }
    }
    
    document.head.appendChild(script); // Add new script tag to head

    // New code to load tree data for Vis3
    if (visName === 'Vis3') {
        let treeId = localStorage.getItem('treeId');
        
    }
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();