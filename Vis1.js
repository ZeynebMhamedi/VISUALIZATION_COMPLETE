window.onbeforeunload = function() {
    localStorage.clear();
};

document.getElementById("forestSelect").value = "";

// Initialisation
let predictions = {};
let accuracy = {};
let true_values = {};
let nb_etudiants = 0;

// Définition des dimensions de la visualisation.
const width = 5000;
const height = document.getElementById("svgContainer").offsetHeight;
const margin = {top:20, right:20, bottom:0, left:50};

const verticalSpacing = 100;  // Changer la valeur comme nécessaire

// Création du canevas SVG.
const svg = d3.select("#eleves_svg")
  .classed("svg-content", true)
  .attr("height", height);
  
// Add reference to inner container
var innerContainer = d3.select("#innerContainer");

var studentsDisplayed = 0;

// Define a new variable to store the index of the last displayed student
var lastDisplayedIndex = -1;

// Importation dynamique des fichiers predictions
const predictionsImports = {
    full_gea: () => import('./Data/predictions_matrix_gea.js'),
    full_geii: () => import('./Data/predictions_matrix_geii.js'),
    full_info: () => import('./Data/predictions_matrix_info.js'),
    full_icomco: () => import('./Data/predictions_matrix_icomco.js'),
    full_tcc: () => import('./Data/predictions_matrix_tcc.js'),
    full_tcn: () => import('./Data/predictions_matrix_tcn.js'),
};

// Importation dynamique des fichiers accuracy
const accuracyImports = {
    full_gea: () => import('./Data/accuracy_matrix_gea.js'),
    full_geii: () => import('./Data/accuracy_matrix_geii.js'),
    full_info: () => import('./Data/accuracy_matrix_info.js'),
    full_icomco: () => import('./Data/accuracy_matrix_icomco.js'),
    full_tcc: () => import('./Data/accuracy_matrix_tcc.js'),
    full_tcn: () => import('./Data/accuracy_matrix_tcn.js'),
};

// Add text element for the student name
const studentText = svg.append("text")
  .attr("x", margin.left)
  .attr("y", margin.top)
  .attr("font-size", "20px");

// Get the checkboxes
var selectAllCheckbox = document.getElementById('selectAll');
var deselectAllCheckbox = document.getElementById('deselectAll');

// Define radius and colors for the circles
const circleRadius = 10;
const colorSuccess = 'green';
const colorFailure = 'red';

function createStudentGroups() {
    // Create a group for each student
    svg.selectAll('g')
        .data(d3.range(nb_etudiants))
        .enter()
        .append('g')
        .attr('id', (d, i) => 'studentGroup' + i);
}

function generateCheckList() {
    // Clear existing items
    checkListContainer.innerHTML = "";

    // Create new items
    for(var i = 0; i < nb_etudiants; i++){
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "student";
        checkbox.value = "student" + i;
        checkbox.id = "student" + i;

        var label = document.createElement('label')
        label.htmlFor = "student" + i;
        label.appendChild(document.createTextNode('Élève ' + i));

        checkListContainer.appendChild(checkbox);
        checkListContainer.appendChild(label);
        checkListContainer.appendChild(document.createElement("br"));    

        checkbox.addEventListener('change', makeDisplayStudentFunction(i));
    }
}


function displayStudent(studentIndex) {
    // Get prediction and accuracy data for the student
    var predictionData = predictions[studentIndex];
    var accuracyData = accuracy[studentIndex];

    // Create data for the circles and squares
    var data = predictionData.map((pred, i) => ({
        'prediction': pred,
        'accuracy': accuracyData[i],
        'treeId': i 
    }));

    // Define spacing for the circles
    const circleSpacing = 4;

    // Calculate the total width needed for all circles (or rectangles)
    var totalWidth = data.length * (2 * circleRadius + circleSpacing) + margin.left + margin.right;

    // Update the SVG width
    svg.attr("width", totalWidth);

    // Calculate the vertical position for this student
    var verticalPosition = margin.top + studentIndex * verticalSpacing;

    var studentGroup = svg.select('#studentGroup' + studentIndex);

    // Calculate the vertical position for this student
    var verticalPosition = margin.top + (++lastDisplayedIndex) * verticalSpacing;

    // Add the student's name to the group
    studentGroup.append('text')
        .attr('x', 0)
        .attr('y', verticalPosition)
        .attr('font-size', '20px')
        .text("Élève " + studentIndex);

    // Add circles to the svg for predictions
    var circles = studentGroup.selectAll('.circle-eyes').data(data);

    var circleEyesEnter = circles.enter()
        .append('g')
        .attr('class', 'circle-eyes')
        .attr('transform', (d, i) => `translate(${margin.left + i * (2 * circleRadius + circleSpacing)}, ${verticalPosition + 30})`)
        .on('click', function(event, d) {
            // Effacez les anciennes valeurs
            localStorage.removeItem('treeId');
            localStorage.removeItem('studentId');
            // Store the tree id and the student id in localStorage
            localStorage.setItem('treeId', d); // l'indice de l'arbre dans le tableau de prédictions
            localStorage.setItem('studentId', studentIndex); // l'indice de l'élève
            console.log("TREE ID = ", d);
            console.log('STUDENT ID = ', studentIndex);
            // Print the stored values
            console.log("Stored TREE ID = ", localStorage.getItem('treeId'));
            console.log('Stored STUDENT ID = ', localStorage.getItem('studentId'));
            localStorage.setItem('source', 'Vis1');
            // Trigger a click on the Vis3 tab
            document.querySelector('button[onclick="openVis(event, \'Vis3\')"]').click();
        });

    circleEyesEnter
        .append('circle')
        .attr('r', circleRadius)
        .attr('fill', d => d.prediction == 1 ? colorSuccess : colorFailure);

    // Add eye elements (or any other element you want) to the group
    circleEyesEnter
        .append('text')
        .text('👁️') // Replace this with the eye SVG or icon you want to use
        .attr('x', -10) // Adjust the position of the eye relative to the circle
        .attr('y', -7) // Adjust the position of the eye relative to the circle
        .attr('font-size', '16px')
        .attr('opacity', 0) // Hide the eye by default
        .style('cursor', 'pointer')
        .on('click', function(event, d) {
            // This is where the click event on the eye will be handled
            // You can put your logic here for what should happen when the eye is clicked
            // For example, you can show additional information related to the student or prediction
            console.log('Eye clicked for student', studentIndex, 'and tree', d);
        })
        .on('mouseover', function(event, d) {
            // Show the eye when the mouse is over the circle
            d3.select(this).attr('opacity', 1);
        })
        .on('mouseout', function(event, d) {
            // Hide the eye when the mouse leaves the circle
            d3.select(this).attr('opacity', 0);
        });

    // Add squares to the svg for accuracy
    var rectangles = studentGroup.selectAll('rect').data(data);
    rectangles.enter()
        .append('rect')
        .attr('x', (d, i) => margin.left + i * (2 * circleRadius + circleSpacing) - circleRadius)  // Adjust 'x' to be at the beginning of the circle
        .attr('y', (d, i) => verticalPosition + 22 + 2*circleRadius) // Adjust 'y' to be just below the circle
        .attr('width', 2 * circleRadius) // Set the width to the diameter of the circle
        .attr('height', circleRadius)
        .attr('fill', d => d.accuracy == d.prediction ? (d.prediction == 1 ? colorSuccess : colorFailure) : (d.prediction == 1 ? colorFailure : colorSuccess));

    // Calculate the total height needed for all students' visualisations
    var totalHeight = (nb_etudiants) * verticalSpacing + margin.top + margin.bottom;

    // Update the SVG height
    svg.attr("height", totalHeight);
}

function makeDisplayStudentFunction(i) {
    return function() {
        var studentGroup = svg.select('#studentGroup' + i);
        if (this.checked) {
            displayStudent(i);
        } else {
            // Remove the student's visualisation
            studentGroup.selectAll('*').remove();
            
            // Decrease lastDisplayedIndex when a student is removed
            --lastDisplayedIndex;
            
            // Re-render all remaining displayed students to update their vertical positions
            var checkboxes = checkListContainer.getElementsByTagName('input');
            for (var j = 0; j < checkboxes.length; j++) {
                if (checkboxes[j].checked) {
                    var studentGroup = svg.select('#studentGroup' + j);
                    studentGroup.selectAll('*').remove();
                    displayStudent(j);
                }
            }
        }
    }
}
// Add check list items to the check list container
var checkListContainer = document.getElementById('checkListContainer');

document.getElementById("forestSelect").addEventListener("change", async function(event) {
    const { value } = event.target;
    await loadForestVis1(value);
});

async function loadForestVis1(value) {  
    console.log('loadForestVis1 est appelé avec la forêt', value);

    // Effacer toutes les visualisations existantes
    svg.selectAll('g').remove();
    
    // Load the predictions and accuracy data
    const predictionsModule = await predictionsImports[value]();
    const accuracyModule = await accuracyImports[value]();
    
    predictions = predictionsModule.predictions;
    accuracy = accuracyModule.accuracy; 
    nb_etudiants = predictions.length; 
    console.log("nombre d'étudiants = ", nb_etudiants);

    createStudentGroups();
    generateCheckList();
    
    // Ensure all checkboxes are unchecked
    var checkboxes = checkListContainer.getElementsByTagName('input');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type == 'checkbox') {
            checkboxes[i].checked = false;
        }
    }
}
window.loadForestVis1 = loadForestVis1;


// Add event listeners for select all and deselect all checkboxes
selectAllCheckbox.addEventListener('change', function() {
    var checkboxes = checkListContainer.getElementsByTagName('input');
    
    // Deselect all students first
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type == 'checkbox') {
            checkboxes[i].checked = false;
            lastDisplayedIndex = -1;
            var studentGroup = svg.select('#studentGroup' + i);
            studentGroup.selectAll('*').remove();
        }
    }

    // Select all students and display their visualizations
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type == 'checkbox') {
            checkboxes[i].checked = true;
            displayStudent(i);
        }
    }
});

deselectAllCheckbox.addEventListener('change', function() {
    var checkboxes = checkListContainer.getElementsByTagName('input');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type == 'checkbox') {
            checkboxes[i].checked = false;
            // Reset lastDisplayedIndex when all students are deselected
            lastDisplayedIndex = -1;
            var studentGroup = svg.select('#studentGroup' + i);
            studentGroup.selectAll('*').remove();
        }
    }
});

console.log('Vis1.js loaded');