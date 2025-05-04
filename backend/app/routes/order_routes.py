from flask import Blueprint, request, jsonify
from ..decorators import token_required
from app.services.reservation_service import ReservationService

reservation_bp = Blueprint('reservation', __name__)
from ..decorators import token_required

@reservation_bp.route('/api/reservations', methods=['GET'])
@token_required
def get_reservations(current_user):
    user_id = current_user['id']

    success, data, status = ReservationService.get_order(user_id)

    if not success:
        return jsonify({"error": data}), status

    return jsonify({"data": data})
