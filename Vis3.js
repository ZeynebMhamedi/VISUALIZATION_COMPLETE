let treeId = Number(localStorage.getItem('treeId'));
let studentId = Number(localStorage.getItem('studentId'));

// Importation dynamique du fichier tree_info
const treeInfoImport = {
    full_gea: () => import('./Data/tree_info_gea.js'),
    full_geii: () => import('./Data/tree_info_geii.js'),
    full_info: () => import('./Data/tree_info_info.js'),
    full_icomco: () => import('./Data/tree_info_icomco.js'),
    full_tcc: () => import('./Data/tree_info_tcc.js'),
    full_tcn: () => import('./Data/tree_info_tcn.js'),
};

function displayTreeInfo(node, indent = '', showAccuracy = true, accuracy, depth = 0, treeId, studentId, source) {    if (!node) return '';

    if (!node) return '';

    let infoText = '';

    let color = generateColor(depth);
    infoText += '<div class="tree-node" style="background-color: ' + color + '">';

    if (indent === '') {
        infoText += '<big><strong>Tree ID: ' + treeId;
        if (source === 'Vis1') {
            infoText += ', Student ID: ' + studentId;
        }
        infoText += '</strong></big><br>';
    }
    

    // On affiche le nom et le seuil uniquement pour les nœuds non-feuilles
    if (node.children && node.children.length > 0) {
        infoText += indent + '<span class="tree-arrow"></span><strong>Node: </strong>' + node.name + ' <strong><=</strong> ' + parseFloat(node.threshold).toFixed(2) + '<br>';
    }

    // Affichage de l'accuracy si showAccuracy est vrai
    if (showAccuracy) {
        infoText += indent + ' <strong>accuracy = </strong>' + accuracy + '<br>';
        console.log("Accuracy = ", accuracy);
    }

    // On affiche les autres informations pour tous les éléments (sauf l'accuracy)
    infoText += indent + ' <strong>gini = </strong>' + Math.ceil(node.gini * 100) / 100 + '<br>';
    infoText += indent + ' <strong>samples = </strong>' + node.samples + '<br>';
    infoText += indent + ' <strong>value = </strong>[' + node.value + ']' + '<br>';
    infoText += indent + ' <strong>class = </strong>' + node.classes + '<br>';

    // Si le nœud a des enfants, on les affiche également
    if (node.children && node.children.length > 0) {
        for (let childIndex = 0; childIndex < node.children.length; childIndex++) {
            const child = node.children[childIndex];
            if (child && Object.keys(child).length > 0) {
                const isLastChild = childIndex === node.children.length - 1;
                const lineClass = isLastChild ? '' : 'tree-line';
                infoText += '<div class="' + lineClass + '">';
                infoText += displayTreeInfo(child, indent + '&emsp;', false, accuracy, depth + 1, treeId, studentId, source);
                infoText += '</div>';
            }
        }
    }

    infoText += '</div>'; 

    return infoText;
}

// Dans la fonction loadForestVis3
async function loadForestVis3(forestName) {
    console.log('loadForestVis3 est appelé avec la forêt ', forestName);

    // Récupération des valeurs de treeId et studentId
    let treeId = Number(localStorage.getItem('treeId'));
    let studentId = Number(localStorage.getItem('studentId'));

    // Récupération de la source
    let source = localStorage.getItem('source'); 

    // Effacement du contenu précédent
    infoDisplay.innerHTML = '';

    let infoText = 'Tree ID: ' + treeId;
    // Si la source est Vis1, alors affichez le studentId
    if (source === 'Vis1') {
        infoText += ', Student ID: ' + studentId;
    }
    infoText += '<br>';

    infoDisplay.innerHTML = infoText;

    d3.select('#selected-feature-display').text('');
    
    const selectedData = forestName;

    // Importation des données
    treeInfoImport[selectedData]().then(module => {
        const treeInfo = module.treeInfo; 

        let tree = treeInfo.find(t => t.id === treeId);
        let accuracy = treeInfo[0].accuracy;
        console.log("Accuracy:", accuracy);
        
        if (tree) {
            infoDisplay.innerHTML = '<div class="tree-container">' + displayTreeInfo(tree.info, '', true, accuracy, 0, treeId, studentId, source) + '</div>';
        }
    });
}
// Rendez la fonction accessible globalement
window.loadForestVis3 = loadForestVis3;


function generateColor(depth) {
    // Utilisez depth pour changer la teinte. 
    // Modulo 360 est utilisé pour s'assurer que la valeur reste entre 0 et 360
    let hue = depth * 100 % 360;
    return "hsl(" + hue + ", 100%, 75%)";
}
