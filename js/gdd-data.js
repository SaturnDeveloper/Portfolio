// js/gdd-data.js

window.GDD = {
  kicker: "Game Design Document / Insights",
  title: "Dark Phantom",
  subtitle: "Dark Fantasy Action / Story Prototype – Design, Systems & Production Notes.",

  heroImage: "assets/img/placeholder.jpg",

  meta: [
    "Genre: Dark Fantasy / Action",
    "Engine: Unity (C#)",
    "Role: Design + Programming + Writing",
    "Status: Prototype"
  ],

  links: {
    primary: { label: "Trailer", url: "https://example.com" },
    secondary: { label: "Build / Repo", url: "https://example.com" }
  },

  sections: [
    {
      id: "overview",
      title: "Overview",
      type: "text",
      body: [
        "Pitch in 2–3 Sätzen: Worum geht’s, was ist die Fantasy, was ist das Zielgefühl?",
        "Kurz: Setting, Zielgruppe, USP (Unique Selling Point)."
      ]
    },
    {
      id: "pillars",
      title: "Design Pillars",
      type: "cards",
      cards: [
        { title: "Atmosphäre", points: ["Industrial Occult Mood", "Gloom + Mystery", "Cosmic Horror undertone"] },
        { title: "Gameplay", points: ["Readable combat loop", "Tight controls", "Risk/Reward"] },
        { title: "Narrative", points: ["Lore fragments", "Environmental storytelling", "Player discovery"] },
      ]
    },
    {
      id: "loop",
      title: "Core Gameplay Loop",
      type: "list",
      intro: "Der Loop ist das Herz. Kurz und messbar:",
      items: [
        "Explore → find clue / encounter",
        "Combat / challenge → earn resources",
        "Upgrade / prepare → new area",
        "Story beat → next objective"
      ]
    },
    {
      id: "combat",
      title: "Combat & Systems",
      type: "cards",
      cards: [
        { title: "Player Kit", points: ["Light/Heavy", "Dodge/Guard", "Special tool / occult device"] },
        { title: "Enemies", points: ["Readable telegraphs", "Weak points", "Status / poison / curse"] },
        { title: "Progression", points: ["Gear upgrades", "Perks", "Crafting reagents"] },
      ]
    },
    {
      id: "levels",
      title: "Level & Worldbuilding",
      type: "text",
      body: [
        "Wie sind Zonen aufgebaut? (Hub → Branches, linear, metroidvania?)",
        "Wie werden Lore/Story im Level vermittelt? (Props, Notizen, Audio, Events)"
      ],
      figure: {
        src: "assets/img/placeholder.jpg",
        caption: "Optional: Map-Skizze / Blockout Screenshot / Moodboard."
      }
    },
    {
      id: "art",
      title: "Art Direction",
      type: "list",
      intro: "Konkrete Leitlinien, damit es konsistent bleibt:",
      items: [
        "Material language: iron / soot / copper accents",
        "Lighting: high contrast, silhouettes, fog volumes",
        "UI: minimal, diegetic hints, muted palettes"
      ]
    },
    {
      id: "tech",
      title: "Technical Breakdown",
      type: "cards",
      cards: [
        { title: "Architecture", points: ["State machine", "Data-driven configs", "Reusable components"] },
        { title: "Tools", points: ["Unity + C#", "Custom inspectors", "Build pipeline notes"] },
        { title: "Rendering", points: ["Post-processing", "Fog", "Stylized shading (optional)"] },
      ]
    },
    {
      id: "learnings",
      title: "Challenges & Learnings",
      type: "list",
      intro: "Das ist Portfolio-Gold. Ehrlich, konkret, kurz:",
      items: [
        "Was war die größte Design-Entscheidung und warum?",
        "Was hat nicht funktioniert? Was hast du geändert?",
        "Was würdest du im nächsten Iterationszyklus verbessern?"
      ]
    }
  ]
};