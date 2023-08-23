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

const verticalSpacing = 100;  

// Création du canevas SVG.
const svg = d3.select("#eleves_svg")
  .classed("svg-content", true)
  .attr("height", height);
  
var innerContainer = d3.select("#innerContainer");

var studentsDisplayed = 0;

// Variable pour stocker l'indice du dernier étudiant affiché
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

// Ajout d'un élément de texte pour le nom de l'étudiant
const studentText = svg.append("text")
  .attr("x", margin.left)
  .attr("y", margin.top)
  .attr("font-size", "20px");

// Récupère les cases à cocher
var selectAllCheckbox = document.getElementById('selectAll');
var deselectAllCheckbox = document.getElementById('deselectAll');

// Définit le rayon et les couleurs des cercles
const circleRadius = 10;
const colorSuccess = 'green';
const colorFailure = 'red';

function createStudentGroups() {
        // Créer un groupe pour chaque étudiant
         svg.selectAll('g')
        .data(d3.range(nb_etudiants))
        .enter()
        .append('g')
        .attr('id', (d, i) => 'studentGroup' + i);
}

function generateCheckList() {
    // Efface les éléments existants
    checkListContainer.innerHTML = "";

    // Créer de nouveaux éléments
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
    // Obtenir des données de prédiction et de précision pour l'élève
    var predictionData = predictions[studentIndex];
    var accuracyData = accuracy[studentIndex];

    // Créer les données pour les cercles et les carrés
    var data = predictionData.map((pred, i) => ({
        'prediction': pred,
        'accuracy': accuracyData[i],
        'treeId': i 
    }));

    // Définir l'espacement des cercles
    const circleSpacing = 4;

    // Calcule la largeur totale nécessaire pour tous les cercles (ou rectangles)
    var totalWidth = data.length * (2 * circleRadius + circleSpacing) + margin.left + margin.right;

    // Mise à jour du SVG width
    svg.attr("width", totalWidth);

    // Calcule la position verticale de cet élève
    var verticalPosition = margin.top + studentIndex * verticalSpacing;

    var studentGroup = svg.select('#studentGroup' + studentIndex);

    var verticalPosition = margin.top + (++lastDisplayedIndex) * verticalSpacing;

    // Ajoute le nom de l'élève au groupe
    studentGroup.append('text')
        .attr('x', 0)
        .attr('y', verticalPosition)
        .attr('font-size', '20px')
        .text("Élève " + studentIndex);

    // Ajouter des cercles au svg pour les prédictions
    var circles = studentGroup.selectAll('.circle-eyes').data(data);

    var circleEyesEnter = circles.enter()
        .append('g')
        .attr('class', 'circle-eyes')
        .attr('transform', (d, i) => `translate(${margin.left + i * (2 * circleRadius + circleSpacing)}, ${verticalPosition + 30})`)
        .on('click', function(event, d) {
            // Effacez les anciennes valeurs
            localStorage.removeItem('treeId');
            localStorage.removeItem('studentId');
            // Stocke treeId et studentId dans localStorage
            localStorage.setItem('treeId', d); // l'indice de l'arbre dans le tableau de prédictions
            localStorage.setItem('studentId', studentIndex); // l'indice de l'élève
            console.log("Stored TREE ID = ", localStorage.getItem('treeId'));
            console.log('Stored STUDENT ID = ', localStorage.getItem('studentId'));
            localStorage.setItem('source', 'Vis1');
            // Déclencher un clic sur l'onglet Vis3
            document.querySelector('button[onclick="openVis(event, \'Vis3\')"]').click();
        });

    circleEyesEnter
        .append('circle')
        .attr('r', circleRadius)
        .attr('fill', d => d.prediction == 1 ? colorSuccess : colorFailure);

    // Ajouter des yeux au groupe
    circleEyesEnter
        .append('text')
        .text('👁️') 
        .attr('x', -10) 
        .attr('y', -7) 
        .attr('font-size', '16px')
        .attr('opacity', 0)
        .style('cursor', 'pointer')
        .on('click', function(event, d) {
            console.log('Eye clicked for student', studentIndex, 'and tree', d);
        })
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 1);
        })
        .on('mouseout', function(event, d) {
            d3.select(this).attr('opacity', 0);
        });

    // Ajouter des carrés au svg pour plus de précision
    var rectangles = studentGroup.selectAll('rect').data(data);
    rectangles.enter()
        .append('rect')
        .attr('x', (d, i) => margin.left + i * (2 * circleRadius + circleSpacing) - circleRadius)
        .attr('y', (d, i) => verticalPosition + 22 + 2*circleRadius) 
        .attr('width', 2 * circleRadius) 
        .attr('height', circleRadius)
        .attr('fill', d => d.accuracy == d.prediction ? (d.prediction == 1 ? colorSuccess : colorFailure) : (d.prediction == 1 ? colorFailure : colorSuccess));

    // Calcule la hauteur totale nécessaire pour toutes les visualisations des élèves
    var totalHeight = (nb_etudiants) * verticalSpacing + margin.top + margin.bottom;

    // Mise à jour du SVG height
    svg.attr("height", totalHeight);
}

function makeDisplayStudentFunction(i) {
    return function() {
        var studentGroup = svg.select('#studentGroup' + i);
        if (this.checked) {
            displayStudent(i);
        } else {
            // Supprimer la visualisation de l'élève
            studentGroup.selectAll('*').remove();
            
            // Décrémente lastDisplayedIndex lorsqu'un étudiant est supprimé
            --lastDisplayedIndex;
            
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
// Ajouter les éléments de la check list au conteneur check list 
var checkListContainer = document.getElementById('checkListContainer');

document.getElementById("forestSelect").addEventListener("change", async function(event) {
    const { value } = event.target;
    await loadForestVis1(value);
});

async function loadForestVis1(value) {  
    console.log('loadForestVis1 est appelé avec la forêt', value);

    // Effacer toutes les visualisations existantes
    svg.selectAll('g').remove();
    
    // Charger les prédictions et les données de précision
    const predictionsModule = await predictionsImports[value]();
    const accuracyModule = await accuracyImports[value]();
    
    predictions = predictionsModule.predictions;
    accuracy = accuracyModule.accuracy; 
    nb_etudiants = predictions.length; 
    console.log("nombre d'étudiants = ", nb_etudiants);

    createStudentGroups();
    generateCheckList();
    
    // Assurez-vous que toutes les cases sont décochées
    var checkboxes = checkListContainer.getElementsByTagName('input');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type == 'checkbox') {
            checkboxes[i].checked = false;
        }
    }
}
window.loadForestVis1 = loadForestVis1;


// Ajouter des écouteurs d'événements pour tout sélectionner et décocher toutes les cases
selectAllCheckbox.addEventListener('change', function() {
    var checkboxes = checkListContainer.getElementsByTagName('input');
    
    // on commence par déselectionner tous les etudiants
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type == 'checkbox') {
            checkboxes[i].checked = false;
            lastDisplayedIndex = -1;
            var studentGroup = svg.select('#studentGroup' + i);
            studentGroup.selectAll('*').remove();
        }
    }

    // Sélectionner tous les étudiants et afficher leurs visualisations
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
            // Réinitialiser lastDisplayedIndex lorsque tous les étudiants sont désélectionnés
            lastDisplayedIndex = -1;
            var studentGroup = svg.select('#studentGroup' + i);
            studentGroup.selectAll('*').remove();
        }
    }
});

console.log('Vis1.js loaded');
