import re

file_path = r"c:\Users\Patrice.DESKTOP-I932PON\Dev\saas-ai-starter\trajektia\frontend-web\src\pages\metiers\[cnp].astro"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Hero Banner Offres d'emploi count
content = content.replace(
    '''<span class="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {metier.offres_emploi.length} Offres en direct
        </span>''',
    '''{metier.offres_emploi && metier.offres_emploi.length > 0 && (
        <span class="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {metier.offres_emploi.length} Offres en direct
        </span>
        )}'''
)

# 2. Update Quick Action Jump Links
old_links = '''<!-- Quick Action Jump Links -->
      <div class="mt-6 flex flex-wrap gap-2.5">
        <a 
          href="#offres-emploi" 
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Offres d'emploi ({metier.offres_emploi.length})
        </a>
        <a 
          href="#riasec" 
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-semibold text-xs border border-purple-200 dark:border-purple-800/60 transition-all"
        >
          🎯 Profil RIASEC ({metier.riasec.code_holland})
        </a>
        <a 
          href="#relance" 
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-semibold text-xs border border-teal-200 dark:border-teal-800/60 transition-all"
        >
          🎓 Relance Québec ({metier.relance_quebec.taux_emploi_en_rapport})
        </a>
        <a 
          href="#salaires" 
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/70 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-600 transition-all"
        >
          Salaires StatCan
        </a>
        <a 
          href="#competences-vertes" 
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800/60 transition-all"
        >
          🌿 Compétences Vertes (ESCO)
        </a>
        <a 
          href="#profil-dpci" 
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/70 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-600 transition-all"
        >
          Profil DPCI & Effort
        </a>
      </div>'''

new_links = '''<!-- Quick Action Jump Links -->
      <div class="mt-6 flex flex-wrap gap-2.5">
        {metier.offres_emploi && metier.offres_emploi.length > 0 && (
        <a 
          href="#offres-emploi" 
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Offres d'emploi ({metier.offres_emploi.length})
        </a>
        )}
        <a 
          href="#riasec" 
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-semibold text-xs border border-purple-200 dark:border-purple-800/60 transition-all"
        >
          🎯 Profil RIASEC ({metier.riasec.code_holland})
        </a>
        {metier.relance_quebec && (
        <a 
          href="#relance" 
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-semibold text-xs border border-teal-200 dark:border-teal-800/60 transition-all"
        >
          🎓 Relance Québec ({metier.relance_quebec.taux_emploi_en_rapport})
        </a>
        )}
        <a 
          href="#salaires" 
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/70 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-600 transition-all"
        >
          Salaires StatCan
        </a>
        {metier.competences?.vertes_esco && metier.competences.vertes_esco.length > 0 && (
        <a 
          href="#competences-vertes" 
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800/60 transition-all"
        >
          🌿 Compétences Vertes (ESCO)
        </a>
        )}
        {metier.dpc && (
        <a 
          href="#profil-dpci" 
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/70 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-600 transition-all"
        >
          Profil DPCI & Effort
        </a>
        )}
      </div>
      
      {metier.niveau_enrichissement === "essentiel" && (
        <div class="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
          <strong>Fiche essentielle — enrichissement en cours.</strong><br/>
          Les données affichées (Secteur, FEER, Salaire, Profil RIASEC) proviennent de :<br/>
          • Salaires : {metier.sources.salaire}<br/>
          • Profil : {metier.sources.riasec}<br/>
          {metier.sources.big_five && `• Traits : ${metier.sources.big_five}`}
        </div>
      )}'''
content = content.replace(old_links, new_links)

# 3. Wrapper pour relance_quebec et perspectives (Bento Grid)
old_relance = '''<!-- CARTE 2 : RELANCE QUÉBEC (INSERTION DES DIPLÔMÉS) -->
    <div id="relance" class="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700/80 shadow-md">'''
new_relance = '''<!-- CARTE 2 : RELANCE QUÉBEC (INSERTION DES DIPLÔMÉS) -->
    {metier.relance_quebec && (
    <div id="relance" class="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700/80 shadow-md">'''

content = content.replace(old_relance, new_relance)
content = content.replace(
    '''      )}
    </div>

    <!-- CARTE 3 : RISQUE D'AUTOMATISATION & IMPACT IA -->''',
    '''      )}
    </div>
    )}

    <!-- CARTE 3 : RISQUE D'AUTOMATISATION & IMPACT IA -->'''
)

old_perspectives = '''<!-- CARTE 3 : RISQUE D'AUTOMATISATION & IMPACT IA -->
    <div class="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700/80 shadow-md">'''
new_perspectives = '''<!-- CARTE 3 : RISQUE D'AUTOMATISATION & IMPACT IA -->
    {metier.perspectives && (
    <div class="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700/80 shadow-md">'''

content = content.replace(old_perspectives, new_perspectives)
content = content.replace(
    '''      </p>
    </div>

  </div>''',
    '''      </p>
    </div>
    )}

  </div>'''
)

# 4. Wrapper pour offres-emploi
content = content.replace(
    '''<section id="offres-emploi" class="mb-10">''',
    '''{metier.offres_emploi && metier.offres_emploi.length > 0 && (
  <section id="offres-emploi" class="mb-10">'''
)
content = content.replace(
    '''<!-- ============================================================ -->
  <!-- NOUVEAU MODULE LEAD MAGNET & ABONNEMENT ALERTES COURRIEL -->''',
    '''</section>
  )}

  <!-- ============================================================ -->
  <!-- NOUVEAU MODULE LEAD MAGNET & ABONNEMENT ALERTES COURRIEL -->'''
)
# Retirer l'ancien </section>
content = content.replace(
    '''  </section>
</section>
  )}''',
    '''</section>
  )}'''
)

# 5. Wrapper pour compétences
content = content.replace(
    '''  <!-- SECTION COMPÉTENCES & TRIPTYQUE CKG (OaSIS, O*NET, ESCO VERT) -->
  <!-- ============================================================ -->
  <section class="mb-10">''',
    '''  <!-- SECTION COMPÉTENCES & TRIPTYQUE CKG (OaSIS, O*NET, ESCO VERT) -->
  <!-- ============================================================ -->
  {metier.competences && (
  <section class="mb-10">'''
)
content = content.replace(
    '''  <!-- ============================================================ -->
  <!-- SECTION PROFIL D'EFFORT ET CONTRAINTES DPC (TRAJEKTIA) -->''',
    '''</section>
  )}

  <!-- ============================================================ -->
  <!-- SECTION PROFIL D'EFFORT ET CONTRAINTES DPC (TRAJEKTIA) -->'''
)
content = content.replace(
    '''  </section>
</section>
  )}''',
    '''</section>
  )}'''
)

# 6. Wrapper pour DPC
content = content.replace(
    '''  <!-- SECTION PROFIL D'EFFORT ET CONTRAINTES DPC (TRAJEKTIA) -->
  <!-- ============================================================ -->
  <section id="profil-dpci" class="mb-10">''',
    '''  <!-- SECTION PROFIL D'EFFORT ET CONTRAINTES DPC (TRAJEKTIA) -->
  <!-- ============================================================ -->
  {metier.dpc && (
  <section id="profil-dpci" class="mb-10">'''
)
content = content.replace(
    '''  <!-- ============================================================ -->
  <!-- SECTION FORMATIONS QUÉBÉCOISES ET PRÉALABLES (DEC / DEP / UNIV) -->''',
    '''</section>
  )}

  <!-- ============================================================ -->
  <!-- SECTION FORMATIONS QUÉBÉCOISES ET PRÉALABLES (DEC / DEP / UNIV) -->'''
)
content = content.replace(
    '''  </section>
</section>
  )}''',
    '''</section>
  )}'''
)

# 7. Wrapper pour formations
content = content.replace(
    '''  <!-- SECTION FORMATIONS QUÉBÉCOISES ET PRÉALABLES (DEC / DEP / UNIV) -->
  <!-- ============================================================ -->
  <section id="formations" class="mb-10">''',
    '''  <!-- SECTION FORMATIONS QUÉBÉCOISES ET PRÉALABLES (DEC / DEP / UNIV) -->
  <!-- ============================================================ -->
  {metier.formations && metier.formations.length > 0 && (
  <section id="formations" class="mb-10">'''
)
content = content.replace(
    '''  <!-- ============================================================ -->
  <!-- SECTION MÉTIERS CONNEXES & PASSERELLES (CKG) -->''',
    '''</section>
  )}

  <!-- ============================================================ -->
  <!-- SECTION MÉTIERS CONNEXES & PASSERELLES (CKG) -->'''
)
content = content.replace(
    '''  </section>
</section>
  )}''',
    '''</section>
  )}'''
)

# 8. Wrapper pour métiers connexes
content = content.replace(
    '''  <!-- SECTION MÉTIERS CONNEXES & PASSERELLES (CKG) -->
  <!-- ============================================================ -->
  <section class="mb-12">''',
    '''  <!-- SECTION MÉTIERS CONNEXES & PASSERELLES (CKG) -->
  <!-- ============================================================ -->
  {metier.metiers_connexes && metier.metiers_connexes.length > 0 && (
  <section class="mb-12">'''
)
content = content.replace(
    '''  <!-- Script interactif d'inscription Lead Capture -->''',
    '''</section>
  )}

  <!-- Script interactif d'inscription Lead Capture -->'''
)
content = content.replace(
    '''  </section>
</section>
  )}''',
    '''</section>
  )}'''
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patching of [cnp].astro complete.")
