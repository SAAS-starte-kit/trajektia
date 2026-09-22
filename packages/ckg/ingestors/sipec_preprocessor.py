import pandas as pd
import json
import os
from pathlib import Path

# --- Configuration ---
RAW_DIR = Path("data/raw/sipec")
PROCESSED_DIR = Path("data/processed")

def setup_environment():
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

def process_matrices():
    """Traite les fichiers matriciels (compétences, habiletés, etc.)."""
    # Liste des fichiers à traiter par type
    matrix_files = {
        "skills": "competences_sipec",
        "abilities": "habilites_oasis",
        "knowledge": "connaissance_sipec",
        "interests": "interets_sipec"
    }

    all_relations = []

    for key, pattern in matrix_files.items():
        # Trouver le fichier FR (priorité)
        matching = [f for f in os.listdir(RAW_DIR) if pattern in f and "_fr.csv" in f]
        if not matching:
            continue
            
        file_path = RAW_DIR / matching[0]
        print(f"📊 Traitement de la matrice: {key} ({matching[0]})")
        
        try:
            # Forcer le point-virgule (standard CSV FR Canada)
            df = pd.read_csv(file_path, sep=';', engine='python', encoding='utf-8-sig')
            
            # Nettoyer les colonnes vides (souvent présentes au début)
            df = df.dropna(axis=1, how='all')
            
            # Identifier dynamiquement la colonne de code (NOC)
            # Elle contient généralement des chiffres et des points (ex: 11.20)
            code_col = None
            for col in df.columns:
                if any(isinstance(x, str) and "." in x for x in df[col].astype(str).head(10)):
                    code_col = col
                    break
            
            if not code_col:
                code_col = df.columns[0]
            
            # La colonne suivante est l'Étiquette
            label_col = df.columns[list(df.columns).index(code_col) + 1]
            
            # Les données commencent après le label
            start_index = list(df.columns).index(label_col) + 1
            data_cols = df.columns[start_index:]
            
            print(f"   ↳ Code: {code_col}, Label: {label_col}, Données: {len(data_cols)} colonnes")

            # Forcer la conversion numérique sur les colonnes de données
            for col in data_cols:
                df[col] = pd.to_numeric(df[col].astype(str).str.replace(',', '.'), errors='coerce').fillna(0)

            melted = df.melt(id_vars=[code_col, label_col], value_vars=data_cols, 
                             var_name='Descriptor', value_name='Weight')
            
            # Nettoyer les données (conserver uniquement les poids > 0)
            melted = melted[melted['Weight'] > 0]
            
            for _, row in melted.iterrows():
                all_relations.append({
                    "noc_code": str(row[code_col]),
                    "occupation_title": row[label_col],
                    "descriptor_type": key,
                    "descriptor_label": row['Descriptor'],
                    "weight": float(row['Weight'])
                })
                
        except Exception as e:
            print(f"⚠️ Erreur sur {key}: {e}")

    # Sauvegarder les relations
    output_file = PROCESSED_DIR / "sipec_relations.jsonl"
    with open(output_file, "w", encoding='utf-8') as f:
        for rel in all_relations:
            f.write(json.dumps(rel, ensure_ascii=False) + "\n")
            
    print(f"✅ {len(all_relations)} relations extraites dans {output_file}")

def process_narratives():
    """Traite les descriptions narratives (1.5 Mo)."""
    pattern = "competencesprincipales_sipec"
    matching = [f for f in os.listdir(RAW_DIR) if pattern in f and "_fr.csv" in f]
    
    if not matching:
        return

    output_file = PROCESSED_DIR / "sipec_narratives.jsonl"
    print(f"📝 Traitement des descriptions: {matching[0]}")
    
    try:
        df = pd.read_csv(RAW_DIR / matching[0], sep=None, engine='python', encoding='utf-8-sig')
        # On suppose les colonnes 'Code SIPeC', 'Étiquette', 'Description'
        records = df.to_dict('records')
        
        with open(output_file, "w", encoding='utf-8') as f:
            for rec in records:
                f.write(json.dumps(rec, ensure_ascii=False) + "\n")
        print(f"✅ Descriptions sauvegardées dans {output_file}")
    except Exception as e:
        print(f"⚠️ Erreur narratifs: {e}")

if __name__ == "__main__":
    setup_environment()
    process_matrices()
    process_narratives()
