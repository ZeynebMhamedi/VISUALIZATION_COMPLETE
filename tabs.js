// Au chargement de la fenêtre, nous supprimons l'élément 'selectedForest' du local storage
window.onload = function() {
    localStorage.removeItem('selectedForest');
};

function openVis(evt, visName) {
    var i, tabcontent, tablinks;

    // Récupère tous les éléments avec la classe="tabcontent" et les cache
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Récupère tous les éléments avec la classe="tablinks" et retire la classe "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Montre l'onglet actuel et ajoute la classe "active" au bouton qui a ouvert l'onglet
    document.getElementById(visName).style.display = "block";
    evt.currentTarget.className += " active";
    
    // Supprime le script de visualisation existant s'il existe
    let oldScript = document.getElementById('vis-script');
    if (oldScript) {
        document.head.removeChild(oldScript);
    }

    // Crée un nouveau tag script
    let script = document.createElement('script');
    script.src = visName + '.js'; // Définit la source du fichier JavaScript approprié
    script.id = 'vis-script'; // Définit l'id pour pouvoir le supprimer plus tard
    script.type = "module"; // Ajoute le type de module
    script.onload = function() {
        // Écouteur pour le changement de sélection de la forêt
        const forestSelect = document.getElementById('forestSelect');
        if (forestSelect) {
            forestSelect.addEventListener('change', async function(event) {
                const { value } = event.target;
    
                // Enregistre la sélection dans le local storage
                localStorage.setItem('selectedForest', value);
    
                // Vérifie quel script est actuellement chargé
                let currentScript = document.getElementById('vis-script');
                if (currentScript) {
                    let scriptName = currentScript.src.split('/').pop().split('.')[0];
                    console.log(scriptName); // pour débogage
    
                    // Exécute la fonction appropriée pour charger la forêt
                    if (scriptName === 'Vis1') {
                        loadForestVis1(value);
                    } else if (scriptName === 'Vis2') {
                        loadForestVis2(value);
                    } else if (scriptName === 'Vis3') {
                        loadForestVis3(value);
                    }
                }
            });
    
            // Appelle la fonction loadForest immédiatement après le chargement du script
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
    
    document.head.appendChild(script); // Ajoute le nouveau tag script à l'élément head

    // Nouveau code pour charger les données de l'arbre pour Vis3
    if (visName === 'Vis3') {
        let treeId = localStorage.getItem('treeId');
        
    }
}

// Récupère l'élément avec id="defaultOpen" et clique dessus
document.getElementById("defaultOpen").click();
