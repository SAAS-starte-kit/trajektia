import re

file_path = r"c:\Users\Patrice.DESKTOP-I932PON\Dev\saas-ai-starter\trajektia\frontend-web\src\pages\metiers\index.astro"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update frontmatter to extract secteurs
content = content.replace(
    '''const totalMetiers = METIERS_DATA.length;
const totalOffres = METIERS_DATA.reduce((acc, m) => acc + (m.offres_emploi?.length || 0), 0);''',
    '''const totalMetiers = METIERS_DATA.length;
const totalOffres = METIERS_DATA.reduce((acc, m) => acc + (m.offres_emploi?.length || 0), 0);
const secteurs = [...new Set(METIERS_DATA.map(m => m.secteur))].sort();'''
)

# 2. Update Secteur filter
old_secteur_filter = '''<option value="">Tous les secteurs</option>
          <option value="Technologies de l'information">Tech & Informatique</option>
          <option value="Construction et Énergie">Construction & Énergie</option>
          <option value="Santé et Services sociaux">Santé & Social</option>
          <option value="Finance, Gestion et Comptabilité">Finance & Gestion</option>
          <option value="Fabrication métallique et Aérospatiale">Industrie & Métallurgie</option>'''
new_secteur_filter = '''<option value="">Tous les secteurs</option>
          {secteurs.map(secteur => (
            <option value={secteur}>{secteur}</option>
          ))}'''
content = content.replace(old_secteur_filter, new_secteur_filter)

# 3. Update data-skills
content = content.replace(
    '''data-skills={metier.competences.techniques_oasis.concat(metier.competences.vertes_esco).join(' ').toLowerCase()}''',
    '''data-skills={metier.competences ? metier.competences.techniques_oasis.concat(metier.competences.vertes_esco).join(' ').toLowerCase() : ''}'''
)

# 4. Update relance_quebec display
content = content.replace(
    '''{metier.relance_quebec.taux_emploi_en_rapport}''',
    '''{metier.relance_quebec?.taux_emploi_en_rapport || "N/D"}'''
)

# 5. Update compétences vertes display
old_competences_vertes = '''<p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 italic bg-emerald-50/60 dark:bg-emerald-950/30 px-2.5 py-1.5 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40">
              🌿 ESCO : "{metier.competences.vertes_esco[0]}"
            </p>'''
new_competences_vertes = '''{metier.competences?.vertes_esco && metier.competences.vertes_esco.length > 0 && (
            <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 italic bg-emerald-50/60 dark:bg-emerald-950/30 px-2.5 py-1.5 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40">
              🌿 ESCO : "{metier.competences.vertes_esco[0]}"
            </p>
            )}'''
content = content.replace(old_competences_vertes, new_competences_vertes)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patching of index.astro complete.")
