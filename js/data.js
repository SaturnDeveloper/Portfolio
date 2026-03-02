// js/data.js
// medium: "3D" | "2D" | "Games" | "Film" | "Photo"

window.PROJECTS = [
  {
    id: "dark-phantom",
    title: "Dark Phantom (Prototype)",
    medium: "Games",
    tags: ["Unity", "Story", "Gameplay"],
    year: "2025",
    short: "Düsteres Fantasy-Action/Story Prototype.",
    role: "Design + Programming + Writing",
    stack: ["Unity", "C#"],
    links: [{ label: "Video", url: "https://example.com" }],
    insights: "game.html", 
    media: { type: "image", src: "assets/img/placeholder.jpg" },
    details: ["Combat Loop", "Narrative", "UI/UX"]
  },
 {
  id: "laughing-man",
  title: "Laughing Man",
  medium: "3D",
  tags: ["Hard Surface", "PBR"],
  year: "2025",
  short: "3D Asset Turntable mit Breakdown.",
  role: "Modeling + Lookdev",
  stack: ["Blender", "Substance"],
  links: [{ label: "ArtStation", url: "https://example.com" }],
  media: {
    type: "gallery",
    images: [
      "assets/img/laughing_man.png",
      "assets/img/laughing_man2.png"
    ]
  },
  details: ["High/Low", "Bakes", "Textures"]
},
  {
    id: "cosmic-chess",
    title: "Cosmic Chess",
    medium: "3D",
    tags: ["Hard Surface", "PBR"],
    year: "2025",
    short: "3D Asset Turntable mit Breakdown.",
    role: "Modeling + Lookdev",
    stack: ["Blender", "Substance"],
    links: [{ label: "ArtStation", url: "https://example.com" }],
    media: { type: "image", src: "assets/img/cosmic_chess.png" },
    details: ["High/Low", "Bakes", "Textures"]
  },
  {
    id: "textures",
    title: "Textures from Verona",
    medium: "2D",
    tags: ["textures", "environment"],
    year: "2026",
    short: "2D Studies & Concepts.",
    role: "Illustration",
    stack: ["Procreate"],
    links: [{ label: "Textures", url: "textures.html" }],
    media: { type: "image", src: "assets/img/Roman_Ruin_Ground.png" },
    details: ["Value", "Silhouette", "Iteration"]
  },
  {
    id: "short-film-reel",
    title: "Short Film Reel",
    medium: "Film",
    tags: ["Editing", "Cinematography"],
    year: "2026",
    short: "Showreel / Kurzfilm Ausschnitte.",
    role: "Edit + Camera",
    stack: ["Premiere", "After Effects"],
    links: [{ label: "Vimeo", url: "https://example.com" }],
    media: {
  type: "gallery",

  images: [
    "assets/img/project1_01.jpg",
    "assets/img/project1_02.jpg",
    "assets/img/project1_03.jpg"
  ]
 },
    details: ["Cut", "Color", "Sound"]
  },
  {
    id: "lowlight-series",
    title: "Low Light Series",
    medium: "Photo",
    tags: ["Low Light", "Series"],
    year: "2026",
    short: "Fotografie-Serie (low light).",
    role: "Photography + Editing",
    stack: ["Lightroom"],
    links: [{ label: "Gallery", url: "https://example.com" }],
    media: { type: "image", src: "assets/img/placeholder.jpg" },
    details: ["Series narrative", "Color grade"]
  },
 {
    id: "advenura-worldbuilding",
    title: "Advenura Worldbuilding",
    medium: "Writing",
    tags: ["worldbuilding", "fantasy"],
    year: "ongoing",
    short: "The World of my DnD Campaigns",
    role: "Writer + Dungeon Master",
    stack: ["Lightroom"],
    links: [{ label: "Wiki", url: "https://advenura.fandom.com/wiki/Advenura_Wiki" }],
    details: ["Series narrative", "Color grade"]
  }
];

