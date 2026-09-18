import os
import psycopg2
import json

def get_db_careers():
    env_path = ".env"
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip() and not line.startswith('#'):
                k, v = line.split('=', 1)
                os.environ[k.strip()] = v.strip()
    db_url = os.environ.get("SUPABASE_DB_URL")
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    query = """
    SELECT 
        rp.occupation_cnp_code AS cnp,
        o.title_fr,
        h.teer_level,
        AVG(child.median_salary) AS avg_salary,
        rp.r_score, rp.i_score, rp.a_score, rp.s_score, rp.e_score, rp.c_score,
        rp.dominant_code,
        AVG(bf.openness_score) AS openness,
        AVG(bf.conscientiousness_score) AS conscientiousness,
        AVG(bf.extraversion_score) AS extraversion,
        AVG(bf.agreeableness_score) AS agreeableness,
        AVG(bf.neuroticism_score) AS neuroticism
    FROM riasec_profiles rp
    JOIN occupations o ON o.cnp_code = rp.occupation_cnp_code
    LEFT JOIN cnp_hierarchy h ON h.code = rp.occupation_cnp_code
    LEFT JOIN occupations child ON child.cnp_code LIKE rp.occupation_cnp_code || '.%' AND child.salary_source = 'ESDC 2025 Official'
    LEFT JOIN noc_onet_crosswalk xwalk ON xwalk.noc_code = rp.occupation_cnp_code
    LEFT JOIN big_five_profiles bf ON bf.cnp_code = split_part(xwalk.onet_soc_code, '.', 1)
    WHERE length(rp.occupation_cnp_code) = 5
    GROUP BY rp.occupation_cnp_code, o.title_fr, h.teer_level, 
             rp.r_score, rp.i_score, rp.a_score, rp.s_score, rp.e_score, rp.c_score, rp.dominant_code
    ORDER BY rp.occupation_cnp_code
    """
    
    cursor.execute(query)
    rows = cursor.fetchall()
    print(f"Total rows: {len(rows)}")
    
    # Print a few to check
    for row in rows[:3]:
        print(row)

if __name__ == "__main__":
    get_db_careers()
