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

    @staticmethod
    def get_searches_by_user(user_id: int) -> Tuple[bool, str, Any, int]:
        """
        Récupère toutes les recherches d'un utilisateur donné

        Args:
            user_id (int): ID de l'utilisateur

        Returns:
            tuple: (success, message, data, status_code)
        """
        try:
            # Requête SQL pour récupérer les recherches de l'utilisateur
            result = db.session.execute(
                text("SELECT * FROM recherches WHERE client_id = :client_id"),
                {'client_id': user_id}
            )

            # Récupérer les données sous forme de liste de dictionnaires
            rows = result.fetchall()
            data = []

            # Ajouter le champ 'resultat' à chaque recherche
            for row in rows:
                search = dict(row._mapping)
                # Vérifier si la recherche a un `station_id` valide
                if search['station_id']:
                    search['resultat'] = True  # Station valide
                else:
                    search['resultat'] = False  # Station non valide ou recherche libre
                data.append(search)

            return True, "Recherches récupérées avec succès", data, 200

        except SQLAlchemyError as e:
            return False, "Erreur base de données", {'error': str(e)}, 500

        except Exception as e:
            return False, "Erreur inconnue", {'error': str(e)}, 500