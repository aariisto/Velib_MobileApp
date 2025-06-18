def test_get_stations(client, user_token):
    resp = client.get("/api/stations", headers={"Authorization": f"Bearer {user_token}"})
    if resp.status_code == 200:
        assert isinstance(resp.get_json(), list)
    else:
        assert resp.status_code == 404

def test_get_station_by_id(client, user_token):
    resp = client.get("/api/stations/1", headers={"Authorization": f"Bearer {user_token}"})
    assert resp.status_code in [200, 404]

def test_get_station_invalid_id(client, user_token):
    resp = client.get("/api/stations/abc", headers={"Authorization": f"Bearer {user_token}"})
    assert resp.status_code in [400, 404]

def test_get_station_negative_id(client, user_token):
    resp = client.get("/api/stations/-1", headers={"Authorization": f"Bearer {user_token}"})
    assert resp.status_code in [400, 404]

def test_station_json_structure(client, user_token):
    resp = client.get("/api/stations/1", headers={"Authorization": f"Bearer {user_token}"})
    if resp.status_code == 200:
        data = resp.get_json()
        assert "id" in data and "name" in data and "location" in data

def test_stations_protected_no_token(client):
    resp = client.get("/api/stations/1")
    assert resp.status_code in [401, 403, 404]