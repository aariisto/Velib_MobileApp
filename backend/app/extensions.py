"""
Extensions pour l'application Flask
"""
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialisation de l'extension SQLAlchemy
db = SQLAlchemy() 

# Initialisation de l'extension Flask-Migrate
migrate = Migrate()