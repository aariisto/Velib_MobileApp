from sqlalchemy.exc import SQLAlchemyError
from typing import Tuple, Any, List, Dict
from ..extensions import db
from sqlalchemy import text
import logging

class ReservationService:
    """Service pour gérer les réservations"""

    @staticmethod
    def get_order(client_id: int) -> Tuple[bool, str, List[Dict[str, Any]], int]:
        """
        Récupère les réservations d'un client

        Args:
            client_id (int): ID du client

        Returns:
            Tuple[bool, str, List[Dict[str, Any]], int]: (succès, message, données, code_statut)
        """
        try:
            # Validation de l'ID client
            if not client_id or not isinstance(client_id, int):
                return False, "ID client invalide", {"error": "L'ID client doit être un entier valide"}, 400
                
            # Requête SQL sécurisée avec paramètres nommés
            query = """
                SELECT *
                FROM reservations_vue
                WHERE client_id = :id
                ORDER BY create_time DESC
            """
            
            # Exécution de la requête avec paramètres
            result = db.session.execute(text(query), {"id": client_id})
            
            # Conversion en dictionnaire
            reservations = [dict(row._mapping) for row in result.fetchall()]
            
            message = "Réservations récupérées avec succès"
            if not reservations:
                message = "Aucune réservation trouvée pour cet utilisateur"
                
            # Retour standardisé avec message
            return True, message, reservations, 200

        except SQLAlchemyError as e:
            db.session.rollback()
            error_msg = f"Erreur SQL lors de la récupération des réservations : {str(e)}"
            logging.error(error_msg)
            return False, "Erreur de base de données", {"error": str(e)}, 500

        except Exception as e:
            db.session.rollback()
            error_msg = f"Erreur inattendue lors de la récupération des réservations : {str(e)}"
            logging.error(error_msg)
            return False, "Erreur inattendue", {"error": str(e)}, 500
