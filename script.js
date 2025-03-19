let products = [];


// Récupération des produits depuis le fichier JSON
fetch("produits.json")
    .then(function (response) {
        return response.json(); 
    })
    .then(function (data) {
        products = data; // On garde uniquement les données du JSON dans products
        generateTable(); // Génère le tableau
    })
    .catch(function(error) {
        console.log("Erreur lors du chargement du JSON :", error) // Message d'erreur si le JSON n'est pas chargé
    });



// Fonction principal pour générer le tableau des produits
function generateTable() {
    const table = document.getElementById('product-table'   ) // Récupère l'ID "product-table" de l'HTML pour le dynamiser
    table.innerHTML = ""; // On vide le contenu pour pouvoir le retapper ici

    for (let i = 0; i < products.length; i++) { // Boucle sur tout le tableau (Le JSON)
        let product = products[i]; // A chaque éléments du tableau on lui créer une variable "product"

        let tr = document.createElement("tr"); // Créer un <tr> pour remplir le tableau
        tr.classList.add("table-list"); // Ajoute une class "table-list" sur la balise <tr>

        let stockStatus = ""; // Créer une variable "stockStatus" qui servira dans le innerHTML pour faire apparaître un élément (vert ou rouge) en fonction de son stock
        if (product.stock) { // Si le stock de la variable "product" (élément du tableau JSON) 
            stockStatus = "<span class='stock'>🟢</span>"; // Est "true" (>0), affiche "🟢"
        } else { // Sinon
            stockStatus = "<span class='not-in-stock'>🔴</span>"; // Il est false (0), donc affiche "🔴"
        }        

        tr.innerHTML = // Implémentation de l'HTML dans la variable "tr"
        "<td><strong>" + product.reference + "</strong></td>" + // Va chercher le contenu "reference" dans le tableau "product" et le place dans une balise <td>
        "<td>" + product.categorie + "</td>" + // Idem mais avec categorie
        "<td>" + product.libelle + "</td>" + // Idem mais avec libelle
        "<td><strong>" + product.prix + " €</strong></td>" + // Idem mais avec prix
        "<td>" + stockStatus + "</td>" + // Récupère la variable stockStatus et fait apparaître le resultat ici

        "<td>" + 
        // Bouton qui ouvre une modale avec des information du produit. Ici le data-index n'est pas obligatoire puisque l'on boucle directement avec for du bouton en parcourant "document.querySelectorAll(".view-btn")" dans le script.
        "<button class='action-btn view-btn'><i class='fas fa-eye'></i></button>" + 
        // Bouton qui ouvre une modale pour modifier les informations du produit. On utilise "data-index" pour récupérer l'index du produit dans le tableau "products" afin de savoir quel élément est en train d’être modifié.
        "<button class='action-btn modifier-btn' data-index='" + i + "'><i class='fas fa-edit'></i></button>" +
        //Bouton qui supprime une ligne du tableau. On utilise "data-index" pour récupérer l'index du produit dans le tableau "products" afin de savoir quel élément doit être supprimer.
        "<button class='action-btn delete-btn' data-index='" + i + "'><i class='fas fa-trash'></i></button>" +
        "</td>";

        
        table.appendChild(tr); // Ajoute les balises <tr> créées, dans l'HTML
    }

    let viewButton = document.querySelectorAll(".view-btn"); // Récupère la class "view-btn" et la place dans la variable "viewButton"
    for (let i = 0; i < viewButton.length; i++) { // Boucle sur chaque class "view-btn"
        viewButton[i].addEventListener("click", function() { // Ajoute un évènement click sur elle

            let product = products[i]; // On refait la variable product puisqu'on est plus dans la même boucle 

            let modal = document.createElement("div"); // Créer une variable "modal" et lui ajoute une <div>
            modal.classList.add("modal"); // Ajoute la class "modal" sur la <div>

            let modalContent = document.createElement("div"); // Créer une variable modalContent et lui ajoute une <div>
            modalContent.classList.add("modal-content"); // Ajoute la class "modal-content" sur la <div>

            modalContent.innerHTML = // Implémentation de l'HTML
            "<div class='modal-text'>" + // Méthode différente pour ajouter une div. Ici on crée notre div directement dans l'innerHTML (Même resultat ?)
                "<h2><strong>Référence : </strong>" + product.reference + "</h2>" + // Va chercher le contenu "reference" dans le tableau "product"
                "<p><strong>Libellé : </strong>" + product.libelle + "</p>" + // Idem mais avec libelle
                "<p><strong>Description : </strong>" + product.description + "</p>" +// Idem mais avec description
                "<p><strong>Stock : </strong>" + product.stock + "</p>" + // Idem mais avec stock
                "<p><strong>Prix : </strong>" + product.prix + " €</p>" + // Idem mais avec prix
                "<p><strong>Catégorie : </strong>" + product.categorie + "</p>" + // Idem mais avec categorie
            "</div>" + // Ferme la div (Même resultat ?)

            "<img src='" + product.photo + "' alt='photo du produit'>" + // Va chercher le lien pour afficher la photo
            "<button class='close-butn'><i class='fas fa-times'></i></button>"; // Bouton pour fermer la fenêtre

            modal.appendChild(modalContent); // Ajoute la div "modalContent" dans l'HTML
            document.body.appendChild(modal); // Ajoute la div "modal" dans le <body>

            document.querySelector(".container").classList.add("blur"); // On ajoute la class "blur" au container de la page pour un effet de flou quand la modale est ouverte

            let closeBtn = modalContent.querySelector(".close-butn"); // Va récupérer la class "close-butn" dans le "modalContent" et l'importe dans une variable closeBtn
            closeBtn.addEventListener("click", function() { // On ajoute un événeùent au click dessus
                modal.remove(); // Ferme la modale au click
                document.querySelector(".container").classList.remove("blur"); // Enlève la class "blur" au clique
            });
        });
    }

    let modifButton = document.querySelectorAll(".modifier-btn"); // Récupère toutes les class "modifier-btn" et les importes dans une variable modifButton
    for (let i = 0; i < modifButton.length; i++) { // Boucle sur chacune d'elles
        modifButton[i].addEventListener("click", function() { // Ajoute un évènement au clique
        
            let i = parseInt(this.getAttribute("data-index")); // Récupère l'index du produit cliqué en convertissant l'attribut "data-index" en nombre entier
            let product = products[i]; // Récupère le produit correspondant à l'index "i" dans le tableau "products"

            let modal = document.createElement("div"); 
            modal.classList.add("modal");
        
            let modalContent = document.createElement("div");
            modalContent.classList.add("modal-content");           
        
            modalContent.innerHTML = 
            "<div class='modif-text'>" +
                "<h2>Modifier le produit</h2>" +
            
                "<label>Référence :</label>" +
                "<input type='text' id='new-reference' value='" + product.reference + "' disabled>" +
        
                "<label>Libellé :</label>" +
                "<input type='text' id='new-libelle' value='" + product.libelle + "'>" +
        
                "<label>Prix :</label>" +
                "<input type='number' id='new-prix' value='" + product.prix + "'>" +
        
                "<label>Description :</label>" +
                "<textarea id='new-description'>" + product.description + "</textarea>" +
        
                "<label>En stock :</label>" +
                "<input type='text' id='new-stock' value='" + product.stock + "'>" +
        
                "<div class='modal-buttons'>" +
                    "<button class='save-btn'>Enregistrer</button>" +
                    "<button class='close-butn'><i class='fas fa-times'></i></button>" +
                "</div>" +
            "</div>";
        
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            document.querySelector(".container").classList.add("blur");

            let closeBtn = modalContent.querySelector(".close-butn");
            closeBtn.addEventListener("click", function() {
                modal.remove();
                document.querySelector(".container").classList.remove("blur");
            });

            let saveButton = modal.querySelector(".save-btn"); // Récupère la class "save-btn" et l'importe dans la variable saveButton
            saveButton.addEventListener("click", function() { // Ajoute un événement au clique
                product.libelle = document.getElementById("new-libelle").value; // Remplace le libelle du tableau products par la value de l'id new-libelle
                product.prix = document.getElementById("new-prix").value; // Remplace le prix du tableau products par la value de l'id new-prix
                product.description = document.getElementById("new-description").value; // Remplace le description du tableau products par la value de l'id new-description
                product.stock = document.getElementById("new-stock").value; // Remplace le stock du tableau products par la value de l'id new-stock
            
                generateTable(products); // Régénère le tableau
                modal.remove(); // Enlève la modale
                document.querySelector(".container").classList.remove("blur"); // Enlève la class blur
            }); 
        });   
    };



    let deleteButton = document.querySelectorAll(".delete-btn"); // Récuère la class "delete-btn" et l'importe dans la variable deleteButton

    for (let i = 0; i < deleteButton.length; i++) { // Boucle sur chacun d'entre eux
        deleteButton[i].addEventListener("click", function() { // Ajoute un évènement au clique

            let index = parseInt(this.getAttribute("data-index")); // Récupère l'index du produit cliqué
            products = products.filter((product, productIndex) => productIndex !== index); // Filtre le tableau pour ne garder que les produits dont l'index est différent

            generateTable(products); // Met à jour l'affichage
        });
    };    
}

function addProduct () {
    const addButton = document.getElementById("addProduct")

    addButton.addEventListener("click", function() {
        let modal = document.createElement("div"); 
        modal.classList.add("modal");
    
        let modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");       
        
        modalContent.innerHTML =
        "<div class='add-text'>" +
            "<h2>Ajouter un produit</h2>" +

            "<label>Référence :</label>" +
            "<input type=text id='add-reference'>" +

            "<label>Libellé :</label>" +
            "<input type=text id='add-libelle'>" +

            "<label>Prix :</label>" +
            "<input type=text id='add-prix'>" +

            "<label>Stock :</label>" +
            "<input type=text id='add-stock'>" +

            "<label>Description :</label>" +
            "<textarea type=text id='add-description'></textarea>" +

            "<label>Catégorie :</label>" +
            "<input type=text id='add-categorie'>" +

            "<div class='modal-buttons'>" +
                "<button class='confirm-btn'>Enregistrer</button>" +
                "<button class='close-butn'><i class='fas fa-times'></i></button>" +
            "</div>" +
        "</div>";

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        document.querySelector(".container").classList.add("blur");

        let closeBtn = modalContent.querySelector(".close-butn");
            closeBtn.addEventListener("click", function() {
                modal.remove();
                document.querySelector(".container").classList.remove("blur");
        });

        document.querySelector(".confirm-btn").addEventListener("click", function() {
            let newProduct = {
                reference: document.getElementById("add-reference").value,
                libelle: document.getElementById("add-libelle").value,
                prix: parseFloat(document.getElementById("add-prix").value) || 0,
                stock: parseInt(document.getElementById("add-stock").value) || 0,
                description: document.getElementById("add-description").value,
                categorie: document.getElementById("add-categorie").value
            };
        
            products.push(newProduct); // Ajoute le produit sans écraser les anciens
            generateTable(); // Rafraîchit l'affichage
            document.querySelector(".container").classList.remove("blur"); 
            document.body.removeChild(modal); 
        });        
    });
};

addProduct();