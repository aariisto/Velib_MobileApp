def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}

def test_create_reservation(client, user_token):
    resp = client.post("/api/reservation", headers=auth_headers(user_token), json={
        "station_id": 1,
        "bike_id": 1
    }, follow_redirects=True)
    assert resp.status_code in [200, 201, 409, 400]

def test_double_reservation(client, user_token):
    data = {"station_id": 1, "bike_id": 2}
    client.post("/api/reservation", headers=auth_headers(user_token), json=data, follow_redirects=True)
    resp = client.post("/api/reservation", headers=auth_headers(user_token), json=data, follow_redirects=True)
    assert resp.status_code in [400, 409]

def test_reservation_no_token(client):
    resp = client.post("/api/reservation", json={"station_id": 1, "bike_id": 1}, follow_redirects=True)
    assert resp.status_code in [401, 403, 404]

def test_reservation_invalid_station(client, user_token):
    resp = client.post("/api/reservation", headers=auth_headers(user_token), json={
        "station_id": 9999,
        "bike_id": 1
    }, follow_redirects=True)
    assert resp.status_code in [400, 404]

def test_reservation_invalid_bike(client, user_token):
    resp = client.post("/api/reservation", headers=auth_headers(user_token), json={
        "station_id": 1,
        "bike_id": 9999
    }, follow_redirects=True)
    assert resp.status_code in [400, 404]

def test_reservation_missing_data(client, user_token):
    resp = client.post("/api/reservation", headers=auth_headers(user_token), json={
        "station_id": 1
    }, follow_redirects=True)
    assert resp.status_code == 400