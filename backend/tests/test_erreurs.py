def test_404_route_inconnue(client):
    resp = client.get("/api/route/qui/nexiste/pas")
    assert resp.status_code == 404

def test_400_register_vide(client):
    resp = client.post("/api/auth/register", json={})
    assert resp.status_code == 400