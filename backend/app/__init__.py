"""
Initialisation de l'application Flask
"""
import os
import pymysql
print("Initialisation du module app...")

# Installer PyMySQL comme MySQLdb
pymysql.install_as_MySQLdb()
print("PyMySQL installé comme MySQLdb")

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from .extensions import db
from .config import Config

def create_app():
    """
    Crée et configure l'application Flask
    """
    print("Création de l'application Flask...")
    
    # Charger les variables d'environnement
    load_dotenv()
    print("Variables d'environnement chargées")
    
    # Initialiser l'application Flask
    app = Flask(__name__)
    print("Instance Flask créée")
    
    # Configurer l'application
    app.config.from_object(Config)
    print("Configuration chargée")
    
    # Initialiser les extensions
    db.init_app(app)
    CORS(app)
    print("Extensions initialisées")
    
    # Route racine pour test simple
    @app.route('/')
    def index():
        return "API Flask en cours d'exécution"
    
    @app.route('/test')
    def test():
        return jsonify({"message": "L'API fonctionne correctement"})
    
    # Enregistrer les blueprints
    try:
        from .routes.auth_routes import auth_bp
        from .routes.hello_routes import hello_bp
        
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(hello_bp, url_prefix='/api/hello')
        print("Blueprints enregistrés")
    except Exception as e:
        print(f"Erreur lors de l'enregistrement des blueprints: {e}")
    
  
    
    print("Application Flask créée avec succès")
    return app 