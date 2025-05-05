"""
Routes pour la gestion des recherches
"""
from flask import Blueprint, request, jsonify
from ..services.search_service import SearchService
from ..decorators import token_required

# Créer un blueprint pour les routes de recherche
search_bp = Blueprint('search', __name__)

@search_bp.route('/delete', methods=['POST'])
@token_required
def delete_search(*args, **kwargs):
    """
    Endpoint pour supprimer une recherche par son ID
    ---
    Requiert un JSON avec id_search ET user_id
    Requiert un token JWT valide
    Le user_id dans la requête doit correspondre à celui du token (OBLIGATOIRE)
    """
    try:
        # Récupérer l'ID utilisateur depuis le token JWT
        token_user_id = kwargs.get('user_id')
        
        # Récupérer les données JSON de la requête
        data = request.get_json()
        
        # Vérifier que les paramètres obligatoires sont présents
        required_params = ['id_search', 'user_id']
        missing_params = [param for param in required_params if param not in data]
        
        if missing_params:
            return jsonify({
                'error': f"Paramètre(s) manquant(s): {', '.join(missing_params)}",
                'error_code': 'MISSING_PARAMETER',
                'token': False
            }), 400
        
        id_search = data['id_search']

            
        # Appeler le service de recherche pour la suppression avec l'ID utilisateur
        success, message, response_data, status_code = SearchService.delete_search(id_search, token_user_id)
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'user_id': token_user_id  # Retourner l'ID utilisateur pour confirmer
            }), status_code
        else:
            return jsonify(response_data), status_code
            
    except Exception as e:
        return jsonify({
            'error': f"Erreur inattendue: {str(e)}",
            'error_code': 'UNKNOWN_ERROR',
            'token': False
        }), 500
    

@search_bp.route('/', methods=['GET'])
@token_required
def get_user_searches(*args, **kwargs):
    """
    Endpoint pour récupérer les recherches de l'utilisateur authentifié
    Requiert un token JWT valide
    """
    try:
        user_id = kwargs.get('user_id')  # fourni par le décorateur token_required

        # Appel au service pour récupérer les recherches
        success, message, data, status_code = SearchService.get_searches_by_user(user_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'data': data
            }), status_code
        else:
            return jsonify({
                'success': False,
                'message': message
            }), status_code

    except Exception as e:
        return jsonify({
            'error': f"Erreur serveur: {str(e)}",
            'error_code': 'SERVER_ERROR'
        }), 500