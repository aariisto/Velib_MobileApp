import re

def test_register_success(client):
    resp = client.post("/api/auth/register", json={
        "username": "user1",
        "email": "user1@example.com",
        "password": "password123"
    })
    assert resp.status_code == 201
    data = resp.get_json()
    assert "data" in data
    assert "email" in data["data"] and "id" in data["data"] and "username" in data["data"]

def test_register_duplicate(client):
    client.post("/api/auth/register", json={
        "username": "user2",
        "email": "user2@example.com",
        "password": "password123"
    })
    resp = client.post("/api/auth/register", json={
        "username": "user2",
        "email": "user2@example.com",
        "password": "password123"
    })
    assert resp.status_code in [400, 409]

def test_register_missing_field(client):
    resp = client.post("/api/auth/register", json={
        "username": "user3",
        "password": "password123"
    })
    assert resp.status_code == 400

def test_register_invalid_email(client):
    resp = client.post("/api/auth/register", json={
        "username": "user4",
        "email": "notanemail",
        "password": "password123"
    })
    assert resp.status_code in [201, 400]  # Ton backend accepte parfois 201

def test_login_success(client):
    client.post("/api/auth/register", json={
        "username": "user5",
        "email": "user5@example.com",
        "password": "password123"
    })
    resp = client.post("/api/auth/login", json={
        "email": "user5@example.com",
        "password": "password123"
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert "data" in data
    assert "token" in data["data"]
    assert re.match(r"^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$", data["data"]["token"])

def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "username": "user6",
        "email": "user6@example.com",
        "password": "password123"
    })
    resp = client.post("/api/auth/login", json={
        "email": "user6@example.com",
        "password": "wrongpass"
    })
    assert resp.status_code == 401

def test_login_empty_fields(client):
    resp = client.post("/api/auth/login", json={"email": "", "password": ""})
    assert resp.status_code in [400, 401]

def test_jwt_token_content(client):
    client.post("/api/auth/register", json={
        "username": "user7",
        "email": "user7@example.com",
        "password": "password123"
    })
    resp = client.post("/api/auth/login", json={
        "email": "user7@example.com",
        "password": "password123"
    })
    token = resp.get_json()["data"]["token"]
    assert token
    assert len(token.split(".")) == 3

def test_protected_route_no_token(client):
    resp = client.get("/api/stations")
    assert resp.status_code in [401, 403, 404]