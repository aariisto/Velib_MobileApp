"""
Service pour la gestion des recherches
"""
from sqlalchemy.exc import SQLAlchemyError
from typing import Tuple, Dict, Any
from ..extensions import db
from sqlalchemy import text

class SearchService:
    """Service pour gérer les opérations liées aux recherches"""
    
    @staticmethod
    def delete_search(id_search: int, user_id: int) -> Tuple[bool, str, Dict[str, Any], int]:
        """
        Supprime une recherche par son ID
        
        Args:
            id_search (int): Identifiant de la recherche à supprimer
            user_id (int): Identifiant de l'utilisateur qui fait la demande (obligatoire)
            
        Returns:
            tuple: (success, message, response_data, status_code)
        """
        try:
            # Vérifier la propriété de la recherche
            check_result = db.session.execute(
                text('SELECT COUNT(*) FROM recherches WHERE id = :id AND client_id = :client_id'),
                {'id': id_search, 'client_id': user_id}
            )
            count = check_result.scalar()
            
            if count == 0:
                return False, "Vous n'êtes pas autorisé à supprimer cette recherche", {
                    'error': 'Recherche non trouvée ou accès non autorisé',
                    'error_code': 'ACCESS_DENIED',
                    'token': True
                }, 403

            # Exécuter la requête de suppression SQL avec text() explicite
            delete_query = 'DELETE FROM recherches WHERE id = :id AND client_id = :client_id'
            params = {'id': id_search, 'client_id': user_id}
                
            result = db.session.execute(
                text(delete_query),
                params
            )
            
            # Valider la transaction
            db.session.commit()
            
            # Vérifier si une ligne a été supprimée
            if result.rowcount > 0:
                return True, f"Recherche {id_search} supprimée avec succès", {}, 200
            else:
                return True, f"Aucune recherche trouvée avec l'id {id_search}", {}, 200
                
        except SQLAlchemyError as e:
            # Annuler la transaction en cas d'erreur
            db.session.rollback()
            return False, f"Erreur lors de la suppression de la recherche: {str(e)}", {
                'error': str(e),
                'error_code': 'DATABASE_ERROR',
                'token': False
            }, 500
            
        except Exception as e:
            db.session.rollback()
            return False, f"Erreur inattendue: {str(e)}", {
                'error': str(e),
                'error_code': 'UNKNOWN_ERROR',
                'token': False
            }, 500