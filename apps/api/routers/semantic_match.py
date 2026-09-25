from fastapi import APIRouter, Request, HTTPException
from apps.api.schemas import JobMatchItem, JobSemanticMatchRequest, JobSemanticMatchResponse

router = APIRouter()

@router.post("/semantic-match", response_model=JobSemanticMatchResponse)
async def semantic_match(req: JobSemanticMatchRequest, request: Request):
    db_pool = getattr(request.app.state, 'db_pool', None)
    
    if db_pool is None:
        # Mock results
        mock_score = 0.95
        matches = []
        if mock_score >= req.min_score:
            matches.append(
                JobMatchItem(
                    id=1,
                    external_id="mock-123",
                    job_title="Développeur Backend",
                    cnp_code=req.cnp if req.cnp else "21232",
                    city="Montréal",
                    region=req.region if req.region else "QC",
                    similarity_score=mock_score
                )
            )
        
        return JobSemanticMatchResponse(
            query=req.query,
            total_matches=len(matches),
            matches=matches
        )
    
    # Check if ML model is available
    has_ml = getattr(request.app.state, 'has_ml', False)
    if not has_ml:
        raise HTTPException(status_code=500, detail="ML model not loaded")
        
    model = request.app.state.semantic_model
    embeddings = list(model.embed([req.query]))
    vector = embeddings[0].tolist()
    vector_str = "[" + ",".join(map(str, vector)) + "]"
    
    # Build query
    base_query = """
        SELECT id, external_id, job_title, cnp_code, city, region,
               1 - (embedding <=> $1::vector) AS score
        FROM job_postings_vectors
        WHERE 1=1
    """
    
    params = [vector_str]
    param_idx = 2
    
    if req.cnp:
        base_query += f" AND cnp_code = ${param_idx}"
        params.append(req.cnp)
        param_idx += 1
        
    if req.region:
        base_query += f" AND region = ${param_idx}"
        params.append(req.region)
        param_idx += 1
        
    base_query += f" AND (1 - (embedding <=> $1::vector)) >= ${param_idx}"
    params.append(req.min_score)
    param_idx += 1
    
    base_query += f" ORDER BY score DESC LIMIT ${param_idx}"
    params.append(req.top_k)
    
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(base_query, *params)
        
    matches = []
    for r in rows:
        matches.append(
            JobMatchItem(
                id=r["id"],
                external_id=r["external_id"],
                job_title=r["job_title"],
                cnp_code=r["cnp_code"],
                city=r["city"],
                region=r["region"],
                similarity_score=float(r["score"])
            )
        )
        
    return JobSemanticMatchResponse(
        query=req.query,
        total_matches=len(matches),
        matches=matches
    )
