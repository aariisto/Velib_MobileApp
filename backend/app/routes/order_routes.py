from flask import Blueprint, request, jsonify
from ..decorators import token_required
from app.services.reservation_service import ReservationService
import logging

reservation_bp = Blueprint('reservation', __name__)  # Correction de la définition du blueprint

@reservation_bp.route('/', methods=['GET'])
@token_required
def get_reservations(*args, **kwargs):
    try:
        # Vérification que user_id est présent et valide
        user_id = kwargs.get('user_id')
        if not user_id or not isinstance(user_id, int):
            return jsonify({"success": False, "message": "ID utilisateur invalide ou manquant"}), 400
        
        # Appel au service avec gestion complète des retours
        success, message, data, status = ReservationService.get_order(user_id)

        if not success:
            return jsonify({
                "success": False,
                "message": message,
                "error": data
            }), status

        # Réponse en cas de succès
        return jsonify({
            "success": True,
            "message": message,
            "data": data
        }), status
        
    except Exception as e:
        # Logging de l'erreur
        logging.error(f"Erreur lors de la récupération des réservations: {str(e)}")
        return jsonify({
            "success": False,
            "message": "Une erreur inattendue s'est produite",
            "error": str(e)
        }), 500
