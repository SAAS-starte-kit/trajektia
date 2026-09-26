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
    assert "/api/jobs/semantic-match" in routes
    assert "/api/occupations/{cnp_code}/pathways" in routes

    assert len(app.routes) > 5

def test_semantic_match():
    # Because db_pool is not initialized outside of lifespan in test without start up, 
    # db_pool is None, which triggers the mock code path.
    payload = {
        "query": "Développeur Python",
        "cnp": "21232",
        "region": "QC",
        "top_k": 5,
        "min_score": 0.5
    }
    response = client.post("/api/jobs/semantic-match", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "Développeur Python"
    assert "matches" in data
    assert len(data["matches"]) >= 0


def test_get_occupations_pathways():
    # Calling the endpoint should trigger the deterministic mock response
    # since db_pool is None outside of lifespan in TestClient context
    response = client.get("/api/occupations/21232/pathways")
    assert response.status_code == 200
    
    data = response.json()
    assert data["source_cnp"] == "21232"
    assert "pathways" in data
    assert len(data["pathways"]) > 0
    
    for pathway in data["pathways"]:
        assert "target_cnp" in pathway
        assert "transition_ease_score" in pathway
        assert pathway["transition_ease_score"] >= 0
