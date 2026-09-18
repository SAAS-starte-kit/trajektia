import pptxgen from "pptxgenjs";
import { narrationScripts } from "./narration";
import { AFE_CONFIG } from "../../data/afe-config";

// Colors (Hex format without '#')
const COLORS = {
  DARK: "0F172A",      // brand-dark
  BLUE: "2563EB",      // brand-blue
  LIGHT_BLUE: "EFF6FF",
  YELLOW: "FBBF24",    // brand-yellow
  LIGHT_YELLOW: "FEF3C7",
  GREEN: "22C55E",     // brand-green
  LIGHT_GREEN: "DCFCE7",
  PURPLE: "8B5CF6",    // brand-purple
  LIGHT_PURPLE: "F3E8FF",
  RED: "EF4444",       // brand-red
  LIGHT_RED: "FEE2E2",
  WHITE: "FFFFFF",
  GRAY: "475569",
  LIGHT_GRAY: "F1F5F9"
};

export const generatePresentationPPTX = () => {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.defineLayout({ name: "CUSTOM", width: 13.33, height: 7.5 });
  pptx.layout = "CUSTOM";

  // Helper for adding footer to standard slides
  const addFooter = (slide: pptxgen.Slide) => {
    slide.addText("Cap sur ton avenir financier — Guide de l'Aide Financière aux Études (AFE)", {
      x: 0.5,
      y: 7.1,
      w: 12.33,
      h: 0.3,
      fontSize: 10,
      color: "94A3B8",
      fontFace: "Segoe UI",
      italic: true
    });
  };

  // Helper for heading / header area on standard slides
  const addHeader = (slide: pptxgen.Slide, title: string, subtitle?: string) => {
    slide.addText(title, {
      x: 0.5,
      y: 0.4,
      w: 12.33,
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: COLORS.DARK,
      fontFace: "Segoe UI"
    });

    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.5,
        y: 1.0,
        w: 12.33,
        h: 0.4,
        fontSize: 16,
        color: "64748B",
        fontFace: "Segoe UI"
      });
    }

    // Nice separator line below header
    slide.addShape(pptx.ShapeType.line, {
      x: 0.5,
      y: 1.5,
      w: 12.33,
      h: 0.02,
      line: { color: "CBD5E1", width: 1 }
    });
  };

  // ==========================================
  // SLIDE 1: Title
  // ==========================================
  const slide1 = pptx.addSlide();
  slide1.background = { fill: COLORS.DARK };

  // Yellow badge at top
  slide1.addText("AIDE FINANCIÈRE AUX ÉTUDES (AFE)", {
    x: 0.5,
    y: 1.8,
    w: 12.33,
    h: 0.5,
    fontSize: 16,
    bold: true,
    color: COLORS.YELLOW,
    fontFace: "Segoe UI",
    align: "center"
  });

  // Main centered title
  slide1.addText("Cap sur ton avenir financier !", {
    x: 0.5,
    y: 2.3,
    w: 12.33,
    h: 1.0,
    fontSize: 48,
    bold: true,
    color: COLORS.WHITE,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide1.addText("Tout comprendre en 15 minutes", {
    x: 0.5,
    y: 3.4,
    w: 12.33,
    h: 0.6,
    fontSize: 28,
    bold: true,
    color: COLORS.YELLOW,
    fontFace: "Segoe UI",
    align: "center"
  });

  // Subtitle
  slide1.addText("Démystifions ensemble le fonctionnement des prêts et bourses pour ta réussite.", {
    x: 1.5,
    y: 4.3,
    w: 10.33,
    h: 1.0,
    fontSize: 18,
    color: "94A3B8",
    fontFace: "Segoe UI",
    align: "center"
  });

  // ==========================================
  // SLIDE 2: Prêt vs Bourse
  // ==========================================
  const slide2 = pptx.addSlide();
  addHeader(slide2, "Prêt ou Bourse ?", "Quelle est la différence ?");
  addFooter(slide2);

  // Left Column: Le Prêt (Blue Accent block)
  slide2.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 1.9,
    w: 5.8,
    h: 4.8,
    fill: { color: COLORS.LIGHT_BLUE },
    line: { color: COLORS.BLUE, width: 2 }
  });

  slide2.addText("Le Prêt", {
    x: 1.0,
    y: 2.1,
    w: 5.0,
    h: 0.5,
    fontSize: 24,
    bold: true,
    color: COLORS.BLUE,
    fontFace: "Segoe UI"
  });

  slide2.addText(
    [
      { text: "• 0% d'intérêt pendant tes études. Le gouvernement paie pour toi !\n\n", options: { fontSize: 16 } },
      { text: "• Garanti par l'aide sectorielle du gouvernement du Québec.\n\n", options: { fontSize: 16 } },
      { text: "• Remboursement 6 mois après la fin, avec un plan adapté.", options: { fontSize: 16 } }
    ],
    {
      x: 1.0,
      y: 2.8,
      w: 5.0,
      h: 3.6,
      color: COLORS.DARK,
      fontFace: "Segoe UI"
    }
  );

  // Right Column: La Bourse (Yellow/Gold Accent block)
  slide2.addShape(pptx.ShapeType.roundRect, {
    x: 6.9,
    y: 1.9,
    w: 5.8,
    h: 4.8,
    fill: { color: COLORS.LIGHT_YELLOW },
    line: { color: COLORS.YELLOW, width: 2 }
  });

  slide2.addText("La Bourse", {
    x: 7.3,
    y: 2.1,
    w: 5.0,
    h: 0.5,
    fontSize: 24,
    bold: true,
    color: COLORS.DARK,
    fontFace: "Segoe UI"
  });

  slide2.addText(
    [
      { text: "• C'est un cadeau ! 0 $ à rembourser, jamais.\n\n", options: { fontSize: 16 } },
      { text: "• Basée sur tes besoins réels.\n\n", options: { fontSize: 16 } },
      { text: "• Bonus 15% : Si tu finis à temps, le gouvernement efface 15% de ton prêt !", options: { fontSize: 16, bold: true } }
    ],
    {
      x: 7.3,
      y: 2.8,
      w: 5.0,
      h: 3.6,
      color: COLORS.DARK,
      fontFace: "Segoe UI"
    }
  );


  // ==========================================
  // SLIDE 3: Admissibilité
  // ==========================================
  const slide3 = pptx.addSlide();
  addHeader(slide3, "Es-tu admissible ?", "Les 3 clés essentielles");
  addFooter(slide3);

  const cols = [
    { title: "1. Statut légal", desc: "Citoyen canadien, résident permanent, ou personne protégée/réfugiée.", bg: "EFF6FF" },
    { title: "2. Résidence", desc: "Tu dois résider au Québec au moment de ta demande.", bg: "F8FAFC" },
    { title: "3. Programme", desc: "Temps plein en FP, Cégep ou Université.", bg: "EFF6FF" }
  ];

  cols.forEach((col, idx) => {
    const xPos = 0.5 + idx * 4.2;
    slide3.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.9,
      w: 3.9,
      h: 3.6,
      fill: { color: col.bg },
      line: { color: "E2E8F0", width: 1 }
    });

    slide3.addText(col.title, {
      x: xPos + 0.3,
      y: 2.2,
      w: 3.3,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: COLORS.BLUE,
      fontFace: "Segoe UI"
    });

    slide3.addText(col.desc, {
      x: xPos + 0.3,
      y: 2.9,
      w: 3.3,
      h: 2.3,
      fontSize: 16,
      color: COLORS.DARK,
      fontFace: "Segoe UI"
    });
  });

  // Warning text/external link at bottom
  slide3.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 5.8,
    w: 12.33,
    h: 0.9,
    fill: { color: "EFF6FF" },
    line: { color: "BFDBFE", width: 1 }
  });

  slide3.addText("Vous venez de l'étranger ? Consultez l'aide pour les étudiants internationaux.", {
    x: 0.8,
    y: 5.9,
    w: 11.73,
    h: 0.7,
    fontSize: 15,
    color: "1E40AF",
    fontFace: "Segoe UI"
  });


  // ==========================================
  // SLIDE 4: Public vs Privé
  // ==========================================
  const slide4 = pptx.addSlide();
  addHeader(slide4, "Public vs Privé", "Le piège à éviter");
  addFooter(slide4);

  // Col 1: Publics (Green)
  slide4.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.9,
    w: 5.9,
    h: 4.6,
    fill: { color: COLORS.LIGHT_GREEN },
    line: { color: COLORS.GREEN, width: 2 }
  });

  slide4.addText("Établissements Publics", {
    x: 0.9,
    y: 2.1,
    w: 5.1,
    h: 0.5,
    fontSize: 22,
    bold: true,
    color: COLORS.GREEN,
    fontFace: "Segoe UI"
  });

  slide4.addText(
    "Cégeps publics et CFP (Centres de services scolaires) :\n\n" +
    "• Ton programme est généralement reconnu d'office !",
    {
      x: 0.9,
      y: 2.8,
      w: 5.1,
      h: 3.4,
      fontSize: 16,
      color: COLORS.DARK,
      fontFace: "Segoe UI"
    }
  );

  // Col 2: Privés (Red)
  slide4.addShape(pptx.ShapeType.roundRect, {
    x: 6.9,
    y: 1.9,
    w: 5.9,
    h: 4.6,
    fill: { color: COLORS.LIGHT_RED },
    line: { color: COLORS.RED, width: 2 }
  });

  slide4.addText("Collèges Privés", {
    x: 7.3,
    y: 2.1,
    w: 5.1,
    h: 0.5,
    fontSize: 22,
    bold: true,
    color: COLORS.RED,
    fontFace: "Segoe UI"
  });

  slide4.addText(
    "Tu as droit à l'AFE UNIQUEMENT si le programme précis est officiellement reconnu. Vérifie toujours avant de payer ton inscription !\n\n" +
    "👉 Listes des établissements reconnus (PDF)",
    {
      x: 7.3,
      y: 2.8,
      w: 5.1,
      h: 3.4,
      fontSize: 16,
      color: COLORS.DARK,
      fontFace: "Segoe UI"
    }
  );


  // ==========================================
  // SLIDE 5: Autonomie
  // ==========================================
  const slide5 = pptx.addSlide();
  addHeader(slide5, "L'Indépendance Financière", "Quand le salaire des parents ne compte plus");
  addFooter(slide5);

  const autoCriteria = [
    { title: "24 mois de travail", desc: "Sans être aux études à temps plein." },
    { title: "90 crédits univ.", desc: "Ou un baccalauréat complété." },
    { title: "2e ou 3e cycle", desc: "Étudier à temps plein en maîtrise ou doctorat." },
    { title: "Famille", desc: "Marié, parent ou enceinte de 20 semaines." }
  ];

  autoCriteria.forEach((crit, idx) => {
    const isLeft = idx % 2 === 0;
    const isTop = idx < 2;
    const x = isLeft ? 0.5 : 6.9;
    const y = isTop ? 1.8 : 3.4;

    slide5.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 5.9,
      h: 1.4,
      fill: { color: COLORS.LIGHT_GRAY },
      line: { color: "CBD5E1", width: 1 }
    });

    slide5.addText(crit.title, {
      x: x + 0.3,
      y: y + 0.15,
      w: 5.3,
      h: 0.35,
      fontSize: 18,
      bold: true,
      color: COLORS.BLUE,
      fontFace: "Segoe UI"
    });

    slide5.addText(crit.desc, {
      x: x + 0.3,
      y: y + 0.55,
      w: 5.3,
      h: 0.7,
      fontSize: 14,
      color: COLORS.DARK,
      fontFace: "Segoe UI"
    });
  });

  // Myth alert at bottom
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 5.0,
    w: 12.33,
    h: 1.7,
    fill: { color: COLORS.LIGHT_RED },
    line: { color: COLORS.RED, width: 1 }
  });

  slide5.addText("Mythe à déconstruire !", {
    x: 0.8,
    y: 5.15,
    w: 11.73,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: "991B1B",
    fontFace: "Segoe UI"
  });

  slide5.addText("On ne devient pas autonome automatiquement à 25 ans. Il n'y a pas d'âge automatique. Ce sont uniquement les critères ci-dessus qui comptent.", {
    x: 0.8,
    y: 5.6,
    w: 11.73,
    h: 1.0,
    fontSize: 15,
    color: "991B1B",
    fontFace: "Segoe UI"
  });


  // ==========================================
  // SLIDE 6: Handicap
  // ==========================================
  const slide6 = pptx.addSlide();
  addHeader(slide6, "Situations de handicap", "Des règles avantageuses");
  addFooter(slide6);

  // Left Section: DFM (Purple block)
  slide6.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.8,
    w: 5.9,
    h: 3.4,
    fill: { color: COLORS.LIGHT_PURPLE },
    line: { color: COLORS.PURPLE, width: 2 }
  });

  slide6.addText("Déficience Majeure (DFM)", {
    x: 0.9,
    y: 2.0,
    w: 5.1,
    h: 0.45,
    fontSize: 20,
    bold: true,
    color: COLORS.PURPLE,
    fontFace: "Segoe UI"
  });

  slide6.addText(
    "• Temps partiel = Temps plein\n\n" +
    "• ⭐ 100% Bourse (Zéro dette !)",
    {
      x: 0.9,
      y: 2.6,
      w: 5.1,
      h: 1.5,
      fontSize: 16,
      color: COLORS.DARK,
      fontFace: "Segoe UI"
    }
  );

  slide6.addText("👉 Certificat médical (PDF)", {
    x: 0.9,
    y: 4.1,
    w: 5.1,
    h: 0.5,
    fontSize: 16,
    bold: true,
    color: COLORS.PURPLE,
    fontFace: "Segoe UI"
  });

  // Right Section: Troubles d'apprentissage (Gray block)
  slide6.addShape(pptx.ShapeType.roundRect, {
    x: 6.9,
    y: 1.8,
    w: 5.9,
    h: 3.4,
    fill: { color: COLORS.LIGHT_GRAY },
    line: { color: "CBD5E1", width: 1 }
  });

  slide6.addText("Troubles d'apprentissage", {
    x: 7.3,
    y: 2.0,
    w: 5.1,
    h: 0.45,
    fontSize: 20,
    bold: true,
    color: COLORS.DARK,
    fontFace: "Segoe UI"
  });

  slide6.addText(
    "• Temps partiel = Temps plein\n\n" +
    "• ⚖️ Calcul régulier (Prêt + Bourse)",
    {
      x: 7.3,
      y: 2.6,
      w: 5.1,
      h: 2.4,
      fontSize: 16,
      color: COLORS.DARK,
      fontFace: "Segoe UI"
    }
  );

  // Bottom text: Allocation
  slide6.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 5.4,
    w: 12.33,
    h: 1.4,
    fill: { color: "FDF4FF" },
    line: { color: "F3E8FF", width: 1 }
  });

  slide6.addText("Allocation pour besoins particuliers", {
    x: 0.8,
    y: 5.5,
    w: 11.73,
    h: 0.35,
    fontSize: 18,
    bold: true,
    color: COLORS.PURPLE,
    fontFace: "Segoe UI"
  });

  slide6.addText("Pour rembourser des dépenses spécifiques : ordinateur, logiciels spécialisés (Antidote), transport adapté, etc.", {
    x: 0.8,
    y: 5.9,
    w: 11.73,
    h: 0.8,
    fontSize: 15,
    color: COLORS.DARK,
    fontFace: "Segoe UI"
  });


  // ==========================================
  // SLIDE 7: Montants
  // ==========================================
  const slide7 = pptx.addSlide();
  addHeader(slide7, "Combien vas-tu recevoir ?", `Montants de base mensuels (${AFE_CONFIG.anneeScolaire})`);
  addFooter(slide7);

  // Left Block: Chez les parents
  slide7.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 2.0,
    w: 5.9,
    h: 4.4,
    fill: { color: COLORS.LIGHT_GRAY },
    line: { color: "CBD5E1", width: 1 }
  });

  slide7.addText("Chez tes parents", {
    x: 0.9,
    y: 2.3,
    w: 5.1,
    h: 0.5,
    fontSize: 22,
    bold: true,
    color: COLORS.DARK,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide7.addText(`~ ${AFE_CONFIG.subsistance.chezParents} $ / mois`, {
    x: 0.9,
    y: 3.2,
    w: 5.1,
    h: 1.0,
    fontSize: 48,
    bold: true,
    color: COLORS.BLUE,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide7.addText("Dépenses de subsistance de base.", {
    x: 0.9,
    y: 4.5,
    w: 5.1,
    h: 1.5,
    fontSize: 16,
    color: COLORS.GRAY,
    fontFace: "Segoe UI",
    align: "center"
  });

  // Right Block: En appartement
  slide7.addShape(pptx.ShapeType.roundRect, {
    x: 6.9,
    y: 2.0,
    w: 5.9,
    h: 4.4,
    fill: { color: COLORS.LIGHT_GREEN },
    line: { color: COLORS.GREEN, width: 2 }
  });

  slide7.addText("En appartement", {
    x: 7.3,
    y: 2.3,
    w: 5.1,
    h: 0.5,
    fontSize: 22,
    bold: true,
    color: COLORS.DARK,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide7.addText(`~ ${AFE_CONFIG.subsistance.enAppartement} $ / mois`, {
    x: 7.3,
    y: 3.2,
    w: 5.1,
    h: 1.0,
    fontSize: 48,
    bold: true,
    color: COLORS.GREEN,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide7.addText("Loyer, épicerie et besoins essentiels.", {
    x: 7.3,
    y: 4.5,
    w: 5.1,
    h: 1.5,
    fontSize: 16,
    color: COLORS.DARK,
    fontFace: "Segoe UI",
    align: "center"
  });


  // ==========================================
  // SLIDE 8: Résidence réputée
  // ==========================================
  const slide8 = pptx.addSlide();
  addHeader(slide8, "La Résidence Réputée", "Le piège du transport en commun");
  addFooter(slide8);

  slide8.addShape(pptx.ShapeType.roundRect, {
    x: 1.5,
    y: 2.0,
    w: 10.33,
    h: 4.5,
    fill: { color: COLORS.LIGHT_BLUE },
    line: { color: COLORS.BLUE, width: 2 }
  });

  slide8.addText("Calcul de la résidence réputée", {
    x: 2.0,
    y: 2.3,
    w: 9.33,
    h: 0.5,
    fontSize: 24,
    bold: true,
    color: COLORS.BLUE,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide8.addText(
    "Si ton école est accessible en transport en commun depuis chez tes parents, l'AFE te considère comme habitant chez eux...\n\n" +
    `Résultat : ~ ${AFE_CONFIG.subsistance.chezParents} $ au lieu de ${AFE_CONFIG.subsistance.enAppartement} $\n\n` +
    "Même si tu paies un loyer ailleurs ! C'est une surprise fréquente.",
    {
      x: 2.0,
      y: 3.0,
      w: 9.33,
      h: 3.0,
      fontSize: 18,
      color: COLORS.DARK,
      fontFace: "Segoe UI",
      align: "center"
    }
  );


  // ==========================================
  // SLIDE 9: Autres dépenses / Et ce n'est pas tout !
  // ==========================================
  const slide9 = pptx.addSlide();
  addHeader(slide9, "Et ce n'est pas tout !", "Dépenses additionnelles couvertes");
  addFooter(slide9);

  const extras = [
    { title: "📚 Matériel scolaire", desc: "De 231 $ à 500 $ par session selon ton niveau." },
    { title: "💻 Ordinateur", desc: "Prêt de 500 $ par période d'études." },
    { title: "👓 Santé", desc: "Jusqu'à 230 $ pour des lunettes (aux 2 ans)." },
    { title: "👶 Frais de garde", desc: "207 $ / mois / enfant pour la garde." }
  ];

  extras.forEach((ext, idx) => {
    const isLeft = idx % 2 === 0;
    const isTop = idx < 2;
    const x = isLeft ? 0.5 : 6.9;
    const y = isTop ? 1.9 : 4.4;

    slide9.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 5.9,
      h: 2.1,
      fill: { color: COLORS.LIGHT_GRAY },
      line: { color: "CBD5E1", width: 1 }
    });

    slide9.addText(ext.title, {
      x: x + 0.4,
      y: y + 0.2,
      w: 5.1,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: COLORS.BLUE,
      fontFace: "Segoe UI"
    });

    slide9.addText(ext.desc, {
      x: x + 0.4,
      y: y + 0.7,
      w: 5.1,
      h: 1.2,
      fontSize: 16,
      color: COLORS.DARK,
      fontFace: "Segoe UI"
    });
  });


  // ==========================================
  // SLIDE 10: L'équation du calcul
  // ==========================================
  const slide10 = pptx.addSlide();
  addHeader(slide10, "L'équation du calcul", "Comment c'est calculé ?");
  addFooter(slide10);

  // Flow graphic block
  slide10.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.9,
    w: 3.5,
    h: 1.6,
    fill: { color: "EFF6FF" },
    line: { color: COLORS.BLUE, width: 2 }
  });
  slide10.addText("DÉPENSES\nFrais scolaires, loyer, subsistance", {
    x: 0.6,
    y: 2.4,
    w: 3.3,
    h: 0.8,
    fontSize: 14,
    bold: true,
    color: COLORS.BLUE,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide10.addText("-", {
    x: 4.1,
    y: 2.3,
    w: 0.5,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: COLORS.GRAY,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide10.addShape(pptx.ShapeType.roundRect, {
    x: 4.7,
    y: 1.9,
    w: 3.5,
    h: 1.6,
    fill: { color: "FEF3C7" },
    line: { color: COLORS.YELLOW, width: 2 }
  });
  slide10.addText("CONTRIBUTIONS\nParents, conjoint ou travailleur", {
    x: 4.8,
    y: 2.4,
    w: 3.3,
    h: 0.8,
    fontSize: 14,
    bold: true,
    color: "92400E",
    fontFace: "Segoe UI",
    align: "center"
  });

  slide10.addText("=", {
    x: 8.3,
    y: 2.3,
    w: 0.5,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: COLORS.GRAY,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide10.addShape(pptx.ShapeType.roundRect, {
    x: 8.9,
    y: 1.7,
    w: 3.9,
    h: 2.0,
    fill: { color: COLORS.DARK },
    line: { color: COLORS.YELLOW, width: 2 }
  });
  slide10.addText("TON BESOIN\nLe montant d'aide versé", {
    x: 9.0,
    y: 2.3,
    w: 3.7,
    h: 0.8,
    fontSize: 16,
    bold: true,
    color: COLORS.WHITE,
    fontFace: "Segoe UI",
    align: "center"
  });

  // Explainers
  slide10.addText("Le mythe sur les parents :", {
    x: 0.5,
    y: 4.0,
    w: 5.9,
    h: 0.35,
    fontSize: 18,
    bold: true,
    color: COLORS.BLUE,
    fontFace: "Segoe UI"
  });
  slide10.addText("Même s'ils gagnent bien, la contribution baisse s'il y a d'autres enfants ou s'ils sont séparés.", {
    x: 0.5,
    y: 4.4,
    w: 5.9,
    h: 2.2,
    fontSize: 15,
    color: COLORS.DARK,
    fontFace: "Segoe UI"
  });

  slide10.addText("Puis-je avoir une \"jobine\" ?", {
    x: 6.9,
    y: 4.0,
    w: 5.9,
    h: 0.35,
    fontSize: 18,
    bold: true,
    color: COLORS.GREEN,
    fontFace: "Segoe UI"
  });
  slide10.addText("OUI ! Un revenu protégé n'est pas calculé. Travailler n'annule pas ton aide !", {
    x: 6.9,
    y: 4.4,
    w: 5.9,
    h: 2.2,
    fontSize: 15,
    color: COLORS.DARK,
    fontFace: "Segoe UI"
  });


  // ==========================================
  // SLIDE 11: Bourses Perspective Québec
  // ==========================================
  const slide11 = pptx.addSlide();
  addHeader(slide11, "Bourses Perspective Québec", "Information Historique");
  addFooter(slide11);

  slide11.addShape(pptx.ShapeType.roundRect, {
    x: 1.5,
    y: 1.9,
    w: 10.33,
    h: 4.6,
    fill: { color: COLORS.LIGHT_RED },
    line: { color: COLORS.RED, width: 2 }
  });

  slide11.addText("⚠️ Programme fermé", {
    x: 2.0,
    y: 2.4,
    w: 9.33,
    h: 0.6,
    fontSize: 26,
    bold: true,
    color: "991B1B",
    fontFace: "Segoe UI",
    align: "center"
  });

  slide11.addText(
    "• La dernière session d'entrée était l'hiver 2025.\n\n" +
    "• Si tu commences à l'automne 2026, ce programme n'est plus accessible.",
    {
      x: 2.0,
      y: 3.2,
      w: 9.33,
      h: 3.0,
      fontSize: 18,
      color: "7F1D1D",
      fontFace: "Segoe UI",
      align: "center"
    }
  );


  // ==========================================
  // SLIDE 12: Checklist de départ
  // ==========================================
  const slide12 = pptx.addSlide();
  addHeader(slide12, "Checklist de départ", "Prépare-toi avant l'été");
  addFooter(slide12);

  const checklistItems = [
    { num: "1", title: "Code permanent :", desc: "4 lettres + 8 chiffres (bulletin ou lettre d'admission)." },
    { num: "2", title: "NAS :", desc: "Numéro d'assurance sociale obligatoire (Service Canada)." },
    { num: "3", title: "Compte Parents :", desc: "S'ils ne sont pas autonomes, ils doivent aussi se créer un compte." }
  ];

  checklistItems.forEach((item, idx) => {
    const yPos = 1.9 + idx * 1.6;

    // Small square badge with number
    slide12.addShape(pptx.ShapeType.roundRect, {
      x: 0.5,
      y: yPos,
      w: 1.0,
      h: 1.2,
      fill: { color: COLORS.BLUE }
    });

    slide12.addText(item.num, {
      x: 0.5,
      y: yPos + 0.35,
      w: 1.0,
      h: 0.5,
      fontSize: 28,
      bold: true,
      color: COLORS.WHITE,
      fontFace: "Segoe UI",
      align: "center"
    });

    slide12.addText(item.title, {
      x: 1.8,
      y: yPos,
      w: 11.0,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: COLORS.DARK,
      fontFace: "Segoe UI"
    });

    slide12.addText(item.desc, {
      x: 1.8,
      y: yPos + 0.45,
      w: 11.0,
      h: 0.8,
      fontSize: 15,
      color: COLORS.GRAY,
      fontFace: "Segoe UI"
    });
  });


  // ==========================================
  // SLIDE 13: Chemin de l'argent
  // ==========================================
  const slide13 = pptx.addSlide();
  addHeader(slide13, "Le chemin de ton argent", "Les 3 étapes cruciales");
  addFooter(slide13);

  const pathSteps = [
    { title: "1. Le Certificat", desc: "Vers août, l'AFE dépose ton \"Certificat de garantie\" dans ton dossier." },
    { title: "2. La Banque", desc: "Tu DOIS l'apporter à ta banque pour signer ton contrat de prêt." },
    { title: "3. Le Versement", desc: "L'argent est déposé directement dans ton compte chaque mois !" }
  ];

  pathSteps.forEach((step, idx) => {
    const xPos = 0.5 + idx * 4.2;

    slide13.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.9,
      w: 3.9,
      h: 4.5,
      fill: { color: COLORS.LIGHT_GRAY },
      line: { color: "CBD5E1", width: 1 }
    });

    // Circular background badge for steps
    slide13.addShape(pptx.ShapeType.ellipse, {
      x: xPos + 1.25,
      y: 2.2,
      w: 1.4,
      h: 1.4,
      fill: { color: COLORS.DARK }
    });

    slide13.addText((idx + 1).toString(), {
      x: xPos + 1.25,
      y: 2.6,
      w: 1.4,
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: COLORS.WHITE,
      align: "center",
      fontFace: "Segoe UI"
    });

    slide13.addText(step.title, {
      x: xPos + 0.2,
      y: 3.8,
      w: 3.5,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: COLORS.BLUE,
      align: "center",
      fontFace: "Segoe UI"
    });

    slide13.addText(step.desc, {
      x: xPos + 0.2,
      y: 4.4,
      w: 3.5,
      h: 1.8,
      fontSize: 15,
      color: COLORS.DARK,
      align: "center",
      fontFace: "Segoe UI"
    });
  });


  // ==========================================
  // SLIDE 14: Dates clés
  // ==========================================
  const slide14 = pptx.addSlide();
  addHeader(slide14, "Dates à ne pas manquer", "Ton agenda AFE");
  addFooter(slide14);

  const dates = [
    { term: "MAI", detail: "Ouverture des demandes", border: COLORS.YELLOW },
    { term: "45 JOURS", detail: "Délai pour fournir un document demandé", border: COLORS.BLUE },
    { term: "30 JOURS", detail: "Délai pour une demande initiale tardive", border: COLORS.BLUE },
    { term: "29 DÉCEMBRE", detail: "Date butoir finale pour l'année", border: COLORS.RED },
    { term: "JANVIER / FÉVRIER", detail: "Obligatoire : Confirmation des revenus réels", border: COLORS.GREEN, full: true }
  ];

  dates.forEach((date, idx) => {
    if (date.full) {
      slide14.addShape(pptx.ShapeType.roundRect, {
        x: 0.5,
        y: 4.9,
        w: 12.33,
        h: 1.6,
        fill: { color: COLORS.LIGHT_GREEN },
        line: { color: COLORS.GREEN, width: 2 }
      });

      slide14.addText(date.term, {
        x: 0.8,
        y: 5.2,
        w: 3.0,
        h: 0.5,
        fontSize: 24,
        bold: true,
        color: COLORS.DARK,
        fontFace: "Segoe UI"
      });

      slide14.addText(date.detail, {
        x: 3.2,
        y: 5.2,
        w: 9.3,
        h: 1.0,
        fontSize: 16,
        color: COLORS.DARK,
        fontFace: "Segoe UI"
      });
    } else {
      const colIndex = idx % 2;
      const rowIndex = Math.floor(idx / 2);
      const x = colIndex === 0 ? 0.5 : 6.9;
      const y = rowIndex === 0 ? 1.8 : 3.3;

      slide14.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 5.9,
        h: 1.3,
        fill: { color: COLORS.LIGHT_GRAY },
        line: { color: date.border, width: 2 }
      });

      slide14.addText(date.term, {
        x: x + 0.3,
        y: y + 0.15,
        w: 5.3,
        h: 0.3,
        fontSize: 20,
        bold: true,
        color: COLORS.DARK,
        fontFace: "Segoe UI"
      });

      slide14.addText(date.detail, {
        x: x + 0.3,
        y: y + 0.5,
        w: 5.3,
        h: 0.7,
        fontSize: 14,
        color: COLORS.DARK,
        fontFace: "Segoe UI"
      });
    }
  });


  // ==========================================
  // SLIDE 15: Attention aux abandons !
  // ==========================================
  const slide15 = pptx.addSlide();
  slide15.background = { fill: COLORS.RED };

  slide15.addText("ATTENTION AUX ABANDONS !", {
    x: 0.5,
    y: 1.0,
    w: 12.33,
    h: 0.8,
    fontSize: 40,
    bold: true,
    color: COLORS.WHITE,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide15.addText("Le piège qui coûte cher", {
    x: 0.5,
    y: 1.9,
    w: 12.33,
    h: 0.5,
    fontSize: 22,
    bold: true,
    color: COLORS.YELLOW,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide15.addText(
    "Si tu abandonnes un cours et que tu n'es plus à temps plein :\n\n" +
    "• Ton aide est coupée immédiatement.\n\n" +
    "• Tes bourses reçues peuvent devenir des dettes.\n\n" +
    "• Tu devras rembourser les versements en trop.\n\n" +
    "👉 Va toujours voir ton API ou le bureau d'aide financière AVANT d'abandonner !",
    {
      x: 1.0,
      y: 2.7,
      w: 11.33,
      h: 3.8,
      fontSize: 18,
      bold: true,
      color: COLORS.WHITE,
      fontFace: "Segoe UI"
    }
  );


  // ==========================================
  // SLIDE 16: Besoin d'aide ?
  // ==========================================
  const slide16 = pptx.addSlide();
  addHeader(slide16, "Besoin d'aide ?", "Tu n'es jamais seul(e)");
  addFooter(slide16);

  // Left side: school services
  slide16.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.9,
    w: 5.9,
    h: 4.6,
    fill: { color: COLORS.LIGHT_BLUE },
    line: { color: COLORS.BLUE, width: 2 }
  });

  slide16.addText("Ressources à l'école", {
    x: 0.9,
    y: 2.1,
    w: 5.1,
    h: 0.5,
    fontSize: 22,
    bold: true,
    color: COLORS.BLUE,
    fontFace: "Segoe UI"
  });

  slide16.addText(
    "🏫 Bureau d'aide financière de ton établissement.\n\n" +
    "🧭 Conseiller d'orientation (secondaire).",
    {
      x: 0.9,
      y: 2.8,
      w: 5.1,
      h: 3.4,
      fontSize: 18,
      color: COLORS.DARK,
      fontFace: "Segoe UI"
    }
  );

  // Right side: AFE contacts
  slide16.addShape(pptx.ShapeType.roundRect, {
    x: 6.9,
    y: 1.9,
    w: 5.9,
    h: 4.6,
    fill: { color: COLORS.DARK }
  });

  slide16.addText("Contact AFE", {
    x: 7.3,
    y: 2.1,
    w: 5.1,
    h: 0.5,
    fontSize: 22,
    bold: true,
    color: COLORS.YELLOW,
    fontFace: "Segoe UI"
  });

  slide16.addText("Service à la clientèle :", {
    x: 7.3,
    y: 2.8,
    w: 5.1,
    h: 0.3,
    fontSize: 16,
    color: "94A3B8",
    fontFace: "Segoe UI"
  });

  slide16.addText("1-888-345-4505", {
    x: 7.3,
    y: 3.2,
    w: 5.1,
    h: 0.6,
    fontSize: 32,
    bold: true,
    color: COLORS.WHITE,
    fontFace: "Segoe UI"
  });

  slide16.addText(
    "Site officiel :\n\n" +
    "quebec.ca/afe",
    {
      x: 7.3,
      y: 4.1,
      w: 5.1,
      h: 2.2,
      fontSize: 16,
      color: "CBD5E1",
      fontFace: "Segoe UI"
    }
  );


  // ==========================================
  // SLIDE 17: Simulateur
  // ==========================================
  const slide17 = pptx.addSlide();
  slide17.background = { fill: COLORS.BLUE };

  slide17.addText("Prêt à calculer ?", {
    x: 0.5,
    y: 1.8,
    w: 12.33,
    h: 0.6,
    fontSize: 36,
    bold: true,
    color: COLORS.YELLOW,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide17.addText("Utilise le simulateur !", {
    x: 0.5,
    y: 2.6,
    w: 12.33,
    h: 0.8,
    fontSize: 48,
    bold: true,
    color: COLORS.WHITE,
    fontFace: "Segoe UI",
    align: "center"
  });

  slide17.addText(
    "C'est gratuit, anonyme et ça prend 5 minutes pour avoir une estimation réelle.",
    {
      x: 1.0,
      y: 3.8,
      w: 11.33,
      h: 1.5,
      fontSize: 22,
      color: COLORS.LIGHT_BLUE,
      fontFace: "Segoe UI",
      align: "center"
    }
  );

  // CTA Block
  slide17.addShape(pptx.ShapeType.roundRect, {
    x: 4.16,
    y: 5.6,
    w: 5.0,
    h: 1.0,
    fill: { color: COLORS.WHITE },
    line: { color: COLORS.YELLOW, width: 2 }
  });

  slide17.addText("quebec.ca/afe", {
    x: 4.16,
    y: 5.85,
    w: 5.0,
    h: 0.5,
    fontSize: 26,
    bold: true,
    color: COLORS.BLUE,
    fontFace: "Segoe UI",
    align: "center"
  });

  // Assign speaker/presenter narration notes to each slide
  if (narrationScripts && narrationScripts.length >= 17) {
    slide1.addNotes(narrationScripts[0]);
    slide2.addNotes(narrationScripts[1]);
    slide3.addNotes(narrationScripts[2]);
    slide4.addNotes(narrationScripts[3]);
    slide5.addNotes(narrationScripts[4]);
    slide6.addNotes(narrationScripts[5]);
    slide7.addNotes(narrationScripts[6]);
    slide8.addNotes(narrationScripts[7]);
    slide9.addNotes(narrationScripts[8]);
    slide10.addNotes(narrationScripts[9]);
    slide11.addNotes(narrationScripts[10]);
    slide12.addNotes(narrationScripts[11]);
    slide13.addNotes(narrationScripts[12]);
    slide14.addNotes(narrationScripts[13]);
    slide15.addNotes(narrationScripts[14]);
    slide16.addNotes(narrationScripts[15]);
    slide17.addNotes(narrationScripts[16]);
  }

  // Save the PPTX document
  pptx.writeFile({ fileName: "Cap_sur_ton_avenir_financier.pptx" });
};
