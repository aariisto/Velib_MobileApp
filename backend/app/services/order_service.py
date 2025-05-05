from sqlalchemy.exc import SQLAlchemyError
from typing import Tuple, Any
from ..extensions import db
from ..models.order_model import Reservation


class OrderService:
    """Service pour gérer les opérations liées aux commandes."""


    @staticmethod
    def create_order(user_id: int, data: dict) -> Tuple[bool, Any, int]:

        try:
           
            order = Reservation(
                confirmationID=data.get('confirmationID'),
                id_velo=data.get('id_velo'),
                client_id=user_id,
                station_id=data.get('station_id')
            )


           
            db.session.add(order)
            db.session.commit()


           
            return True, {
                "id": order.id,
                "confirmationID": order.confirmationID,
                "id_velo": order.id_velo,
                "client_id": order.client_id,
                "station_id": order.station_id,
                "create_time": order.create_time
            }, 201


        except SQLAlchemyError as e:
           
            db.session.rollback()
            return False, f"Erreur base de données : {str(e)}", 500


        except Exception as e:
           
            db.session.rollback()
            return False, f"Erreur inattendue : {str(e)}", 500