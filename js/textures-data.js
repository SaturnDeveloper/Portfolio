// js/textures-data.js
// Lege die ZIPs z.B. unter assets/textures/ ab.

window.TEXTURE_PACKS = [
  {
    id: "roman-ruin-ground-01",
    title: "Roman Ruin Ground",
    tags: ["rust", "metal", "pbr", "tiling"],
    resolution: "4K",
    maps: ["BaseColor", "Normal", "Roughness", "AO"],
    license: "CC0",
    preview: "assets/img/Roman_Ruin_Ground.png",
    download: "assets/textures/Roman_Ruin_Ground.zip",
    note: "Seamless / tiling. Ideal für industrial scenes."
  },
  {
    id: "concrete-pack-01",
    title: "Concrete Pack 01",
    tags: ["concrete", "stone", "pbr", "tiling"],
    resolution: "2K",
    maps: ["BaseColor", "Normal", "Roughness", "AO", "Height"],
    license: "Attribution",
    preview: "assets/img/placeholder.jpg",
    download: "assets/textures/concrete-pack-01.zip",
    note: "Mit Height map für Parallax/Displacement."
  }
];