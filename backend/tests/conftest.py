import pytest
from server import create_app
from app.extensions import db

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "WTF_CSRF_ENABLED": False,
    })
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def user_token(client):
    # Inscription
    client.post("/api/auth/register", json={
        "username": "userres",
        "email": "userres@example.com",
        "password": "password123"
    })
    # Connexion pour récupérer le token (token uniquement à la connexion)
    resp = client.post("/api/auth/login", json={
        "email": "userres@example.com",
        "password": "password123"
    })
    return resp.get_json()["data"]["token"]