from flask import Blueprint, request, jsonify
from ..decorators import token_required
from ..services.order_service import OrderService




order_bp = Blueprint('order', __name__)


@order_bp.route('/api/orders', methods=['POST'])
@token_required
def post_order(current_user):

    user_id = current_user['id']  
    data = request.get_json()


   
    success, response, status_code = OrderService.create_order(user_id, data)


    if not success:
        return jsonify({"error": response}), status_code


    return jsonify({"message": "Commande créée avec succès", "order": response}), status_code