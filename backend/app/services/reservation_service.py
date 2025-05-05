from sqlalchemy.exc import SQLAlchemyError
from typing import Tuple, Any
from ..extensions import db
from sqlalchemy import text

class ReservationService:
    """Service pour gérer les réservations"""

    @staticmethod
    def get_order(client_id: int) -> Tuple[bool, Any, int]:
        try:
            query = """
                SELECT *
                FROM reservation_vue
                WHERE client_id = :id
                ORDER BY create_time DESC
            """
            result = db.session.execute(text(query), {"id": client_id}).fetchall()
            reservations = [dict(row._mapping) for row in result]
            return True, reservations, 200

        except SQLAlchemyError as e:
            db.session.rollback()
            return False, f"Erreur SQL : {str(e)}", 500

        except Exception as e:
            db.session.rollback()
            return False, f"Erreur inattendue : {str(e)}", 500
