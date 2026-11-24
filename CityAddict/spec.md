# CityAddict — spécification de l’API REST

## 1. Ressources et relations

| Ressource | Description | Relations |
|---|---|---|
| `User` | Compte utilisateur et rôle | Possède des notes, des favoris et des listes |
| `Place` | Restaurant, bar ou café | Possède des notes et peut apparaître dans plusieurs listes |
| `Rating` | Note d’un lieu par un utilisateur | Appartient à un utilisateur et à un lieu |
| `Favorite` | Lien entre un utilisateur et un lieu favori | Appartient à un utilisateur et à un lieu |
| `PlaceList` | Liste de lieux créée par un utilisateur | Appartient à un utilisateur et contient des lieux |
| `ListItem` | Lieu inclus dans une liste | Relie une liste à un lieu |

Un utilisateur ne peut avoir qu’une note et qu’un favori par lieu. Un lieu ne peut apparaître qu’une fois dans une même liste.

## 2. Structures de données

### Lieu

```json
{
  "id": "plc_123",
  "name": "Le Café Central",
  "category": "cafe",
  "description": "Un café de quartier.",
  "address": {
    "street": "10 rue des Fleurs",
    "postalCode": "75011",
    "city": "Paris",
    "country": "France"
  },
  "location": { "latitude": 48.8566, "longitude": 2.3522 },
  "averageRating": 4.2,
  "ratingCount": 18,
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-01-15T10:00:00Z"
}
```

`category` vaut `restaurant`, `bar` ou `cafe`. `averageRating` peut être `null` si le lieu n’a pas encore été noté.

### Note

```json
{
  "id": "rat_456",
  "userId": "usr_123",
  "placeId": "plc_123",
  "score": 4,
  "comment": "Accueil agréable.",
  "status": "published",
  "createdAt": "2026-02-01T12:30:00Z",
  "updatedAt": "2026-02-01T12:30:00Z"
}
```

`score` est un entier compris entre `1` et `5`. `status` vaut `published` ou `hidden`; le statut est contrôlé par la modération.

### Favori

```json
{
  "userId": "usr_123",
  "placeId": "plc_123",
  "createdAt": "2026-02-01T12:30:00Z"
}
```

### Liste et élément de liste

```json
{
  "id": "lst_789",
  "ownerId": "usr_123",
  "name": "Mes cafés préférés",
  "description": "À tester le week-end.",
  "visibility": "private",
  "items": [
    { "placeId": "plc_123", "addedAt": "2026-02-01T12:30:00Z" }
  ],
  "createdAt": "2026-02-01T12:00:00Z",
  "updatedAt": "2026-02-01T12:30:00Z"
}
```

`visibility` vaut `public` ou `private`. Les éléments sont renvoyés avec la liste; les lieux peuvent être récupérés via leur `placeId`.

## 3. Points d’entrée

### Découvrir et rechercher des lieux

| Méthode et route | Accès | Description |
|---|---|---|
| `GET /places` | Public | Parcourir les lieux |
| `GET /places/{placeId}` | Public | Obtenir le détail d’un lieu |
| `GET /places/{placeId}/ratings` | Public | Consulter les notes publiées d’un lieu |

`GET /places` accepte les paramètres facultatifs `q` (recherche textuelle sur le nom et la description), `city`, `category` (`restaurant`, `bar`, `cafe`), `minRating` (0 à 5), `sort` (`name`, `rating`, `newest`), ainsi que `page` et `limit`.

Une recherche sans résultat renvoie une liste vide, avec un code `200`.

### Notes

| Méthode et route | Accès | Description |
|---|---|---|
| `PUT /places/{placeId}/my-rating` | Utilisateur connecté | Créer ou remplacer sa note |
| `DELETE /places/{placeId}/my-rating` | Utilisateur connecté | Supprimer sa propre note |

Corps de `PUT` :

```json
{
  "score": 4,
  "comment": "Accueil agréable."
}
```

`comment` est facultatif (maximum 2 000 caractères). Une note masquée par un administrateur reste masquée même si son auteur la modifie; seul un administrateur peut la republier.

### Favoris

| Méthode et route | Accès | Description |
|---|---|---|
| `GET /me/favorites` | Utilisateur connecté | Lister ses favoris; accepte `page` et `limit` |
| `PUT /me/favorites/{placeId}` | Utilisateur connecté | Ajouter un lieu aux favoris |
| `DELETE /me/favorites/{placeId}` | Utilisateur connecté | Retirer un lieu des favoris |

Le corps de la requête `PUT` est vide. Ajouter un favori déjà existant ne crée pas de doublon.

### Listes de lieux

| Méthode et route | Accès | Description |
|---|---|---|
| `POST /me/lists` | Utilisateur connecté | Créer une liste |
| `GET /me/lists` | Utilisateur connecté | Lister ses listes; accepte `page` et `limit` |
| `GET /lists/{listId}` | Propriétaire ou public | Consulter une liste |
| `PATCH /me/lists/{listId}` | Propriétaire | Modifier le nom, la description ou la visibilité |
| `DELETE /me/lists/{listId}` | Propriétaire | Supprimer une liste |
| `PUT /me/lists/{listId}/places/{placeId}` | Propriétaire | Ajouter un lieu à la liste |
| `DELETE /me/lists/{listId}/places/{placeId}` | Propriétaire | Retirer un lieu de la liste |

Corps de `POST /me/lists` :

```json
{
  "name": "Mes cafés préférés",
  "description": "À tester le week-end.",
  "visibility": "private"
}
```

`name` est obligatoire (1 à 120 caractères), `description` est facultatif (maximum 2 000 caractères) et `visibility` vaut `public` ou `private` (défaut : `private`). `PATCH` accepte un ou plusieurs de ces champs. Les routes de modification sont limitées au propriétaire; une liste privée n’est visible que par celui-ci et les administrateurs.

### Administration et modération

| Méthode et route | Accès | Description |
|---|---|---|
| `POST /admin/places` | Administrateur | Créer un lieu |
| `PATCH /admin/places/{placeId}` | Administrateur | Modifier un lieu |
| `DELETE /admin/places/{placeId}` | Administrateur | Supprimer un lieu |
| `GET /admin/ratings` | Administrateur | Parcourir les notes, notamment celles à modérer; accepte `status`, `page` et `limit` |
| `PATCH /admin/ratings/{ratingId}/moderation` | Administrateur | Masquer ou republier une note |

Les corps de création et de modification d’un lieu reprennent les champs modifiables de la structure `Place`, à l’exception de `id`, des dates et des valeurs calculées (`averageRating`, `ratingCount`). La création exige `name`, `category` et `address` (`street`, `postalCode`, `city`, `country`). Les coordonnées géographiques sont facultatives.

Corps de `PATCH /admin/ratings/{ratingId}/moderation` :

```json
{ "status": "hidden" }
```

`status` accepte `hidden` ou `published`. Seules les notes publiées sont visibles dans les routes publiques et contribuent à la moyenne du lieu.

## 4. Structures de réponse

- Une lecture ou création réussie renvoie la ressource JSON. Une liste renvoie les résultats dans `items` avec les métadonnées `pagination`.
- Une mise à jour renvoie la ressource mise à jour.
- Une suppression réussie renvoie `204 No Content`.
- Une erreur est renvoyée au format suivant :

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "La requête contient des données invalides.",
    "details": [
      { "field": "score", "message": "La valeur doit être comprise entre 1 et 5." }
    ]
  }
}
```

`details` est facultatif; les messages ne doivent pas exposer d’informations internes.

## 5. Codes HTTP

| Code | Signification |
|---|---|
| `200 OK` | Lecture ou mise à jour réussie |
| `201 Created` | Ressource créée; l’en-tête `Location` indique son URL |
| `204 No Content` | Suppression réussie |
| `400 Bad Request` | Paramètre ou corps invalide |
| `401 Unauthorized` | Authentification manquante ou invalide |
| `403 Forbidden` | Rôle insuffisant ou accès interdit à une ressource privée |
| `404 Not Found` | Ressource inexistante |
| `409 Conflict` | Conflit avec une contrainte métier |
| `422 Unprocessable Entity` | Données syntaxiquement valides mais non conformes aux règles métier |
| `500 Internal Server Error` | Erreur inattendue |

## 6. Règles de validation et de visibilité

- Les champs inconnus ou les valeurs hors des domaines indiqués sont rejetés avec une erreur explicite.
- Une note doit référencer un lieu existant; une seule note par utilisateur et par lieu est conservée.
- Seules les notes `published` sont accessibles publiquement et prises en compte dans `averageRating` et `ratingCount`.
- Un lieu supprimé ne peut plus être ajouté aux favoris, aux notes ou aux listes.
- Seuls les lieux et listes publics sont visibles sans authentification. Les ressources privées et les opérations personnelles sont protégées par authentification et contrôle de propriété.
- L’API ne renvoie jamais les jetons d’authentification ni les données sensibles d’un utilisateur dans les ressources décrites ici.