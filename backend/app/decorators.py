"""
Décorateurs pour l'application
"""
from functools import wraps
from flask import request, jsonify
from .services.token_service import TokenService

def token_required(f):
    """
    Décorateur pour protéger les routes qui nécessitent une authentification
    Vérifie la présence et la validité du token JWT
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Chercher le token dans les headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Format: "Bearer <token>"
            except IndexError:
                return jsonify({
                    'success': False,
                    'message': 'Token invalide'
                }), 401
        
        if not token:
            return jsonify({
                'success': False,
                'message': 'Token manquant'
            }), 401
            
        # Vérifier le token
        is_valid, payload = TokenService.verify_token(token)
        if not is_valid:
            return jsonify({
                'success': False,
                'message': payload.get('error', 'Token invalide')
            }), 401
        
        # Ajouter l'ID de l'utilisateur aux arguments de la fonction
        kwargs['user_id'] = payload.get('user_id')
        return f(*args, **kwargs)
        
    return decorated 