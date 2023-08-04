import { generateTree, generateAllGroupsVisualization, generateSpecificGroupVisualization, getColorByAccuracy, calculateBoundingCircle, calculateTreeXPosition, setBubble, toggleSameNodes, prepareDataForVisualization, updateFeatureDropdown} from './functions.js';

//Importation dynamique des fichiers
const forests = {
  full_gea: () => import('./Data/full_gea.js'),
  full_geii: () => import('./Data/full_geii.js'),
  full_info: () => import('./Data/full_info.js'),
  full_icomco: () => import('./Data/full_icomco.js'),
  full_tcc: () => import('./Data/full_tcc.js'),
  full_tcn: () => import('./Data/full_tcn.js'),
};

// Définition des dimensions de la visualisation.
const width = window.innerWidth;
const height = window.innerHeight;
const margin = {top:20, right:20, bottom:70, left:20};

// Création du canevas SVG.
const svg = d3.select("#arbre_svg")
  .attr("width", width)
  .attr("height", height);

// Ajout d'un groupe (g) pour contenir les éléments de la visualisation.
let g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Variables pour ajuster les positions et tailles des arbres.
let xOffset = 0;
let maxHeight = 0;

// Facteur d'espacement vertical pour ajuster l'espace entre les arbres
const verticalSpacingFactor = 1.5;
// Facteur d'espacement pour ajuster l'espace entre les arbres
const spacingFactor = 1.2;

const axisMarginBottom = 150;

let totalWidth = width*0.8;

// Mettre à jour la largeur totale pour inclure le facteur d'espacement
totalWidth = totalWidth * spacingFactor;

// Création d'une échelle pour l'axe de l'accuracy.
const accuracyScale = d3.scaleLinear()
  .domain([1, 0.8, 0.6, 0])
  .range([0, (totalWidth - margin.left - margin.right) / 3, (totalWidth - margin.left - margin.right) * 2 / 3, totalWidth - margin.left - margin.right]);

// Configuration de la disposition de l'arbre.
const treeLayout = d3.tree().size(
  [0.3 * (height - margin.top - margin.bottom), 
  0.3 * (width - margin.left - margin.right)/3.5]);


// Gestionnaire d'événement pour le sélecteur de données
async function loadForestVis2(forestName) {
  console.log('loadForestVis2 est appelé avec la forêt', forestName);
  d3.select('#selected-feature-display').text('');

  // Récupérer l'ensemble de données sélectionné
  const selectedData = forestName;

  // Conversion des données en arbres hiérarchiques.
  const group1 = [];
  const group2 = [];
  const group3 = [];

  // Importer l'ensemble de données sélectionné
  forests[selectedData]().then(({ arbres: dataset }) => {
    dataset.forEach((treeData, i) => {
    const tree = generateTree(treeData, i + 1, treeLayout);
    if (tree.data.accuracy >= 0.8) {
      group1.push(tree);
    } else if (tree.data.accuracy >= 0.6) {
      group2.push(tree);
    } else {
      group3.push(tree);
    }
  });

   // Tri des arbres par accuracy dans l'ordre décroissant dans chaque groupe
  group1.sort((a, b) => b.data.accuracy - a.data.accuracy);
  group2.sort((a, b) => b.data.accuracy - a.data.accuracy);
  group3.sort((a, b) => b.data.accuracy - a.data.accuracy);

  // Concaténation des groupes triés
  const data = group1.concat(group2).concat(group3);

  const boundingCircles = data.map(tree => calculateBoundingCircle(tree));

  // Créer un objet pour mapper les groupes aux plages de précision
  const accuracyRanges = {
    "Tous les groupes": {min: 0, max: 1},
    "Groupe 1": {min: 0.8, max: 1},
    "Groupe 2": {min: 0.6, max: 0.8},
    "Groupe 3": {min: 0, max: 0.6}
  };

  let classes = []; // ajouter un tableau pour stocker les classes
  let caractéristiques = [];

  dataset.forEach(arbre => {
    const extractChildrenNames = (node) => {
      // si le node est une feuille (classe), ajouter à l'array de classes, sinon à caractéristiques
      if (!node.children) {
        classes.push(node.name);
      } else {
        caractéristiques.push(node.name);
        node.children.forEach(child => extractChildrenNames(child));
      }
    };
    if (arbre.children) {
      arbre.children.forEach(child => extractChildrenNames(child));
    }
  });

  classes = [...new Set(classes)];

  // Supprimer les doublons et les trier
  caractéristiques = [...new Set(caractéristiques)];

  classes.sort();

  // Trier les caractéristiques et les groupes
  caractéristiques.sort((a, b) => {
    const numA = parseInt(a.slice(1)); 
    const numB = parseInt(b.slice(1)); 
    return numA - numB; 
  });

  caractéristiques.unshift("Toutes les caractéristiques");

  //Légende des classes
  // créer une échelle de couleur
  let couleur = d3.scaleOrdinal(d3.schemeCategory10);
  // assigner une couleur à chaque classe
  classes.forEach((classe, i) => {
    couleur(classe);
  });

  // Ajout d'une infobulle pour afficher le nom du nœud.
  const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  /////////////////////////////////////////////////////////////////////////
  function generateVisualization(selectedFeature, selectedGroup, selectedFeatures) {
    const { filteredData, selectedAllGroups } = prepareDataForVisualization(selectedFeature, selectedGroup, selectedFeatures, data, accuracyRanges);
    
    // Effacer l'ancienne visualisation
    g.selectAll("*").remove();

    if (selectedAllGroups) {
      generateAllGroupsVisualization(filteredData, selectedFeature, height, totalWidth, boundingCircles, maxHeight, margin, g, axisMarginBottom, svg, tooltip, data, couleur, classes, accuracyScale, verticalSpacingFactor, width, xOffset)  } else {
      generateSpecificGroupVisualization(filteredData, selectedFeature, height, totalWidth, boundingCircles, maxHeight, margin, g, axisMarginBottom, svg, tooltip, data, couleur, classes, verticalSpacingFactor, width, xOffset)
      }
  }

  //****************************************************
  // Générer la visualisation initiale avec toutes les caractéristiques et tous les groupes.
  // Initialiser selectedFeatures avec toutes les caractéristiques
  let selectedFeature = "Toutes les caractéristiques";
  let selectedFeatures = caractéristiques; 
  let selectedGroup = "Tous les groupes";
  generateVisualization(selectedFeature, selectedGroup, selectedFeatures); 


// supprimer les éléments de la légende existante
d3.select('#legende').selectAll('.legende-item').remove();

// sélectionner la légende existante
let legende = d3.select('#legende');

// ajouter un élément pour chaque classe
classes.forEach((classe, i) => {
  legende.append('div')
    .attr('class', 'legende-item')
    .style('background-color', couleur(classe)) // assigner une couleur à chaque classe
    .text(classe);
});

  // Les groupes sont définis manuellement en fonction de la précision
  let groupes = ["Tous les groupes", "Groupe 1", "Groupe 2", "Groupe 3"];

  // Ajouter les caractéristiques à la première liste déroulante
  const selectElementFeature = d3.select('#FeatureSelect');
  const optionsFeature = selectElementFeature.selectAll('option')
    .data(caractéristiques, d => d); 

  optionsFeature.enter()
    .append('option')
    .attr('value', d => d)
    .text(d => d);

  optionsFeature.exit().remove();

  //lorsqu'on clique sur les bouttons "Meilleures" ou "Pires"
  const bestButton = document.getElementById('bestButton');
  const worstButton = document.getElementById('worstButton');

  // Initialiser Select2 après avoir ajouté de nouvelles options
  $('#FeatureSelect').select2();

  $('#FeatureSelect').on('change', function() {
    selectedFeature = $(this).val();
    const selectedGroup = d3.select('#groupSelect').property('value');
    
    // Si l'option "Toutes les caractéristiques" est sélectionnée, désactiver les boutons "Meilleures" et "Pires"
    if (selectedFeature === "Toutes les caractéristiques") {
      bestButton.classList.remove('button-selected');
      worstButton.classList.remove('button-selected');
      
      // Ajouter la classe 'button-unselected' à tous les boutons
      bestButton.classList.add('button-unselected');
      worstButton.classList.add('button-unselected');
    }
    generateVisualization(selectedFeature, selectedGroup, selectedFeatures);
    d3.select('#selected-feature-display').text('');
  });

  // Ajouter les groupes à la deuxième liste déroulante
  const selectElementGroup = d3.select('#groupSelect');
  const optionsGroup = selectElementGroup.selectAll('option')
    .data(groupes, d => d); 

  optionsGroup.enter()
    .append('option')
    .attr('value', d => d)
    .text(d => d);

  optionsGroup.exit().remove();

  selectElementGroup.on('change', function() {
    d3.select('#selected-feature-display').text('');

    const selectedGroup = d3.select(this).property('value');
    const selectedFeature = d3.select('#FeatureSelect').property('value');

    // Supprimer la classe 'button-selected' de tous les boutons
    bestButton.classList.remove('button-selected');
    worstButton.classList.remove('button-selected');

    // Ajouter la classe 'button-unselected' à tous les boutons
    bestButton.classList.add('button-unselected');
    worstButton.classList.add('button-unselected');
    
    generateVisualization(selectedFeature, selectedGroup, selectedFeatures);
  });

//Lorsqu'on choisi une valeur sur le slider
let numFeaturesSlider = document.getElementById('numFeatures');; //pour stocker la valeur choisie 
let featureImportance; // pour stocker les indices des caractéristiques

 // Désactiver le bouton 'best' jusqu'à ce que la requête fetch soit terminée
 bestButton.disabled = true;
 worstButton.disabled = true;
  
 fetch(`Data/feature_importances_${selectedData}.json`)
 .then(response => response.json())
 .then(data => {
   featureImportance = data;
     
     // définir la valeur max de l'input range
     
     numFeaturesSlider.max = featureImportance.length;
     
     // Afficher la valeur max du curseur dans la console
     console.log('La valeur max du curseur est :', numFeaturesSlider.max);
     numFeaturesSlider.value = 0;  // initialize slider with a value of 0
 
     let bubble = document.querySelector(".bubble");  // initialize bubble variable
     setBubble(numFeaturesSlider, bubble);  // initialize bubble
 
     // Mettre à jour la bulle chaque fois que le curseur change
     numFeaturesSlider.addEventListener('input', () => {
         setBubble(numFeaturesSlider, bubble);
         // Log the new slider value
         console.log("La valeur actuelle du curseur est :", numFeaturesSlider.value);
 
         // Supprimer la classe 'button-selected' de tous les boutons
         bestButton.classList.remove('button-selected');
         worstButton.classList.remove('button-selected');
     });
     // Activer le bouton 'best' maintenant que la requête fetch est terminée
   bestButton.disabled = false;
   worstButton.disabled = false;

   bestButton.addEventListener('click', function() {
    
    d3.select('#selected-feature-display').text('');

    if (!bestButton.classList.contains('button-selected')) {
      bestButton.classList.remove('button-unselected');
      bestButton.classList.add('button-selected');
      worstButton.classList.remove('button-selected');
      worstButton.classList.add('button-unselected');
      
      console.log('Bouton Best sélectionné');
      console.log(bestButton.classList);
      console.log("BEST BUTTON : ", bestButton.outerHTML);
      console.log("bestButton.onclick", bestButton.onclick);
   
       // Récupérer toutes les caractéristiques
       selectedFeatures = caractéristiques;
       
       // Remettre la visualisation à l'état initial
       const selectedGroup = d3.select('#groupSelect').property('value');
       generateVisualization(selectedFeature, selectedGroup, selectedFeatures);
   
       // Remettre la liste déroulante à l'état initial
       updateFeatureDropdown(caractéristiques);
   
     } else {
      console.log('Bouton Best déjà sélectionné');
      console.log('Vouc avez cliqué sur le boutton Best !');
      console.log(bestButton.classList);
      console.log("BEST BUTTON : ", bestButton.outerHTML);
      console.log("bestButton.onclick", bestButton.onclick);
   
       // Récupérer le nombre de caractéristiques à partir de la valeur du slider
       let numFeatures = numFeaturesSlider.value;
       console.log("Nombre de meilleures caractéristiques sélectionnées :", numFeatures);
   
       // On prend les 'numFeatures' premiers indices
       let selectedFeatures = featureImportance.slice(0, numFeatures);
   
       // Générer la visualisation avec ces caractéristiques
       const selectedGroup = d3.select('#groupSelect').property('value'); // Get selected group again
       generateVisualization(selectedFeature, selectedGroup, selectedFeatures);
   
       // Mise à jour de la liste déroulante des caractéristiques après la sélection des meilleures
       updateFeatureDropdown(selectedFeatures);
     }
   });
   
   worstButton.addEventListener('click', function() {
    
    d3.select('#selected-feature-display').text('');

    if (!worstButton.classList.contains('button-selected')) {

      worstButton.classList.remove('button-unselected');
      worstButton.classList.add('button-selected');
      bestButton.classList.remove('button-selected');
      bestButton.classList.add('button-unselected');
      
      console.log('Bouton Worst sélectionné');
      console.log(worstButton.classList);
      console.log("WORST BUTTON : ", worstButton.outerHTML); // Doit afficher l'élément du bouton, pas null ou undefined
      console.log("worstButton.onclick", worstButton.onclick); // Doit afficher la fonction de l'événement click, p as null ou undefined

       // Récupérer toutes les caractéristiques
       selectedFeatures = caractéristiques;
   
       // Remettre la visualisation à l'état initial
       const selectedGroup = d3.select('#groupSelect').property('value');
       generateVisualization(selectedFeature, selectedGroup, selectedFeatures);
   
       // Remettre la liste déroulante à l'état initial
       updateFeatureDropdown(caractéristiques);
   
     } else {
      console.log('Bouton Worst déjà sélectionné');   
      console.log('Vouc avez cliqué sur le boutton Worst !');
      console.log(worstButton.classList);
      console.log("WORST BUTTON : ", worstButton.outerHTML); // Doit afficher l'élément du bouton, pas null ou undefined
      console.log("worstButton.onclick", worstButton.onclick); // Doit afficher la fonction de l'événement click, p as null ou undefined
    
       // Récupérer le nombre de caractéristiques à partir de la valeur du slider
       let numFeatures = numFeaturesSlider.value;
       console.log("Nombre de pires caractéristiques sélectionnées :", numFeatures);
   
       // On prend les 'numFeatures' derniers indices
       let selectedFeatures = featureImportance.slice(-numFeatures);
   
       // Générer la visualisation avec ces caractéristiques
       const selectedGroup = d3.select('#groupSelect').property('value'); // Get selected group again
       generateVisualization(selectedFeature, selectedGroup, selectedFeatures);
   
       // Mise à jour de la liste déroulante des caractéristiques après la sélection des pires
       updateFeatureDropdown(selectedFeatures);
     }
   });
 })
 .catch(error => console.error(error));
 
//récupérer les valeurs du fichier feature_values dans un tableau
let featureImportanceValues = []; // Pour stocker les valeurs d'importance des caractéristiques
fetch(`Data/feature_values_${selectedData}.json`)
  .then(response => response.json())
  .then(data => {
    featureImportanceValues = data;

    // Votre code supplémentaire ici pour utiliser les valeurs d'importance des caractéristiques

    console.log('featureImportanceValues:', featureImportanceValues);
  })
  .catch(error => console.error(error));

// Ecouteur d'événement pour fermer le modal
let closeModalButton = document.getElementById('closeModalButton');
closeModalButton.addEventListener('click', function() {
  $('#featureModal').modal('hide');
});


  // Bouton pour afficher le classement des caractéristiques 
  let allButton = document.getElementById('allButton');
  allButton.addEventListener('click', function() {
    let modalBody = '';
    featureImportance.forEach((feature, index) => {
      const featureValue = featureImportanceValues[index]; // Récupérer la valeur correspondante

      const formattedValue = Number(featureValue).toExponential(3); // Formater la valeur en notation exponentielle avec 3 chiffres significatifs
      
      modalBody += `<strong>${index + 1}:</strong> ${feature} <strong>(${formattedValue})</strong><br>`;
    });
    
    document.getElementById('modalBody').innerHTML = modalBody;
    $('#featureModal').modal('show');
  });
});
}
// Rendez la fonction accessible globalement
window.loadForestVis2 = loadForestVis2;
