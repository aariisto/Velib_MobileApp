# Mon App Test - Documentation API

# ==================================================================================

# TODO: PAS OUBLIER DE CHANGER LE LIEN DE CONNEXION MYSQL DANS LE FICHIER .env

# ou dans app/config.py selon votre configuration

# ==================================================================================

## Vue d'ensemble

Ce projet est composé d'une application frontend React Native (Expo) et d'un backend Flask avec une base de données MySQL. Cette documentation se concentre sur les API backend et les fonctionnalités récemment modifiées.

## Architecture Backend

Le backend est structuré selon une architecture modulaire :

- **Routes** : Points d'entrée des API
- **Services** : Logique métier
- **Modèles** : Représentation des données
- **Décorateurs** : Fonctionnalités transversales (authentification, etc.)

## Mise à jour du 7 mai 2025

### Standardisation des modèles ORM dans tous les services

Une refonte majeure des services a été effectuée pour standardiser l'utilisation des modèles ORM SQLAlchemy dans tous les services, en remplaçant les requêtes SQL directes.

#### Services modifiés :

1. **SearchService** (`app/services/search_service.py`)

   - Conversion des requêtes SQL directes en utilisation de modèles ORM
   - Les méthodes `delete_search`, `save_search` et `get_searches_by_user` utilisent maintenant le modèle `Recherche`

2. **ReservationService** (`app/services/reservation_service.py`)
   - Modification de la méthode `get_order` pour utiliser le modèle `Reservation`
   - Standardisation des types de retour pour une meilleure cohérence

#### Avantages de cette refonte :

- **Sécurité améliorée** : Réduction des risques d'injection SQL
- **Cohérence architecturale** : Utilisation uniforme d'une seule approche dans tous les services
- **Meilleure maintenabilité** : Code plus lisible et plus facile à maintenir
- **Portabilité de base de données** : Indépendance par rapport au dialecte SQL utilisé
- **Type safety** : Meilleure gestion des types avec l'ORM

## API disponibles

### 1. Authentification (`/api/auth`)

#### Register - Créer un compte

- **Endpoint** : `POST /api/auth/register`
- **Description** : Enregistre un nouvel utilisateur
- **Corps de la requête** :
  ```json
  {
    "username": "votre_nom_utilisateur",
    "email": "votre_email@exemple.com",
    "password": "votre_mot_de_passe"
  }
  ```
- **Réponse** : Détails de l'utilisateur créé (sans mot de passe)

#### Login - Se connecter

- **Endpoint** : `POST /api/auth/login`
- **Description** : Authentifie un utilisateur et génère un token JWT
- **Corps de la requête** :
  ```json
  {
    "email": "votre_email@exemple.com",
    "password": "votre_mot_de_passe"
  }
  ```
- **Réponse** : Détails utilisateur + token JWT

### 2. Recherche (`/api/search`)

#### Delete - Supprimer une recherche

- **Endpoint** : `POST /api/search/delete`
- **Nécessite** : Token JWT valide (header `Authorization: Bearer <token>`)
- **Description** : Supprime une recherche spécifique. L'utilisateur ne peut supprimer que ses propres recherches.
- **Corps de la requête** :
  ```json
  {
    "id_search": 123,
    "user_id": 456
  }
  ```
- **Réponse** : Confirmation de suppression

## Fonctionnalités modifiées récemment

### 1. Amélioration de la sécurité des tokens JWT

- **Modification** : La vérification du token inclut désormais une validation obligatoire de l'ID utilisateur
- **Fichier** : `app/decorators.py`
- **Description** : Le décorateur `token_required` vérifie désormais que l'ID utilisateur fourni dans la requête correspond bien à celui stocké dans le token JWT, renforçant ainsi la sécurité des API.

### 2. Harmonisation des colonnes de base de données

- **Modification** : Uniformisation de l'utilisation de `client_id` au lieu de `user_id` dans les requêtes SQL
- **Fichier** : `app/services/search_service.py`
- **Description** : Correction d'incohérences qui causaient des erreurs SQL du type "Unknown column 'user_id' in 'where clause'".

### 3. Simplification de l'architecture du module app

- **Modification** : Suppression de la duplication de code entre `__init__.py` et `server.py`
- **Fichiers** : `app/__init__.py` et `server.py`
- **Description** : La fonction `create_app()` est maintenant définie uniquement dans `server.py`, réduisant la redondance et simplifiant la maintenance.

## Installation et démarrage du serveur

### Prérequis

- Python 3.x
- MySQL
- Un environnement virtuel Python (recommandé)

### Étapes de démarrage

1. Naviguez vers le dossier backend

```bash
cd backend
```

2. Installez les dépendances

```bash
pip install -r requirements.txt
```

3. Démarrez le serveur

```bash
python server.py
```

Le serveur démarre par défaut sur le port 5001 (http://localhost:5001).

## Guide complet d'utilisation avec Postman

⚠️ **IMPORTANT**: Toutes les API doivent être testées uniquement avec Postman pour garantir une utilisation correcte des tokens JWT.

### Configuration initiale de Postman

1. **Téléchargez et installez** [Postman](https://www.postman.com/downloads/)
2. **Créez une nouvelle collection** nommée "Mon App Test API"
3. **Configurez une variable d'environnement** pour l'URL de base:
   - Nom: `base_url`
   - Valeur initiale: `http://localhost:5001`

### Créer un compte utilisateur

1. **Créez une nouvelle requête**:

   - Méthode: `POST`
   - URL: `{{base_url}}/api/auth/register`
   - Onglet Headers:
     - Key: `Content-Type`
     - Value: `application/json`
   - Onglet Body:
     - Sélectionnez `raw` et `JSON`
     - Ajoutez:
     ```json
     {
       "username": "votre_utilisateur",
       "email": "votre@email.com",
       "password": "votre_mot_de_passe"
     }
     ```
   - Cliquez sur "Send"

2. **Vous recevrez une réponse** avec l'ID utilisateur créé. **Notez cet ID**, vous en aurez besoin plus tard.

### Se connecter et obtenir un token JWT

1. **Créez une nouvelle requête**:

   - Méthode: `POST`
   - URL: `{{base_url}}/api/auth/login`
   - Onglet Headers:
     - Key: `Content-Type`
     - Value: `application/json`
   - Onglet Body:
     - Sélectionnez `raw` et `JSON`
     - Ajoutez:
     ```json
     {
       "email": "votre@email.com",
       "password": "votre_mot_de_passe"
     }
     ```
   - Cliquez sur "Send"

2. **Dans la réponse JSON**, localisez le token JWT. Il se trouve dans `data.token`.

3. **Copiez ce token JWT** - c'est le token que vous utiliserez pour les requêtes authentifiées.

### Supprimer une recherche

1. **Créez une nouvelle requête**:
   - Méthode: `POST`
   - URL: `{{base_url}}/api/search/delete`
2. **Configurez l'authentification Bearer Token**:

   - Onglet Authorization:
     - Type: `Bearer Token`
     - Token: Collez le token JWT que vous avez copié lors de l'étape de connexion

3. **Configurez les headers**:

   - Onglet Headers:
     - Key: `Content-Type`
     - Value: `application/json`

4. **Configurez le corps de la requête**:

   - Onglet Body:
     - Sélectionnez `raw` et `JSON`
     - Ajoutez:
     ```json
     {
       "id_search": 123,
       "user_id": 11
     }
     ```
     ⚠️ **TRÈS IMPORTANT**: Le `user_id` doit correspondre exactement à l'ID de l'utilisateur associé au token JWT, sinon vous obtiendrez une erreur 403.

5. **Envoyez la requête** en cliquant sur "Send"

### Conseils pour éviter les erreurs courantes

- **Ne modifiez pas le token JWT** - il doit être utilisé exactement tel que reçu
- **Assurez-vous que le `user_id`** dans la requête correspond à l'ID de l'utilisateur dans le token JWT
- **Les headers Content-Type** doivent toujours être définis comme `application/json`
- **Vérifiez les erreurs dans la console Postman** si une requête échoue

### Exemples de réponses

#### Réponse de connexion réussie

```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "id": 11,
    "username": "votre_utilisateur",
    "email": "votre@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Erreur d'authentification

```json
{
  "success": false,
  "message": "Accès non autorisé pour cet utilisateur"
}
```

## Remarques importantes

1. L'ID utilisateur est maintenant **obligatoire** pour toutes les routes protégées par le décorateur `token_required`.
2. Une vérification stricte est effectuée entre l'ID fourni dans la requête et celui stocké dans le token JWT.
3. Les recherches ne peuvent être supprimées que par l'utilisateur qui les a créées.
4. La table `recherches` utilise la colonne `client_id` pour référencer les utilisateurs, et non `user_id`.
5. **Pour tester les API, utilisez UNIQUEMENT Postman** en suivant les instructions détaillées ci-dessus.
