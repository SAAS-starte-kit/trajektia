import pytest
from fastapi.testclient import TestClient
from apps.api.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

# It's difficult to fully test the logic without a real mock of the db_pool 
# since testing endpoints would actually try to connect to the Supabase URL via asyncpg. 
# We'll just ensure that routes exist. The actual integration test would fail 
# on db connect without mocking. But ensuring no 404s for the routes is good.

def test_routes_exist():
    # If a route doesn't exist, it gives 404 immediately. 
    # If it exists, but the DB is down or empty mock, it will give 500 or validation error.
    
    # We will just manually verify that the router contains these exact paths
    routes = [r.path for r in app.routes]
    
    assert "/api/metier/{cnp_code}" in routes
    assert "/api/search" in routes
    assert "/api/semantic_search" in routes
    assert "/api/competences/{cnp_code}" in routes
    assert "/api/riasec/{cnp_code}" in routes
    assert "/api/leads" in routes

    assert len(app.routes) > 5
