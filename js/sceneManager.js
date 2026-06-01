let engine = null;
let currentScene = null;
let sceneIndex = 0;

function createEngine() {
  const canvas = document.getElementById("renderCanvas");
  if (!engine) {
    engine = new BABYLON.Engine(canvas, true, { adaptToDeviceRatio: true });
  }
  return engine;
}

function loadScene(index) {
  const engine = createEngine();

  // Alte Szene entfernen
  if (currentScene) {
    currentScene.dispose();
  }

  // Neue Szene laden
  if (index === 0) currentScene = createSceneA(engine);
  if (index === 1) currentScene = createSceneB(engine);
  if (index === 2) currentScene = createSceneC(engine);

  // RenderLoop starten
  engine.runRenderLoop(() => {
    if (currentScene) currentScene.render();
  });
}

document.getElementById("startGameBtn").addEventListener("click", () => {

  document.getElementById("introVideo").classList.add("hidden");
  document.getElementById("renderCanvas").classList.remove("hidden");
  document.getElementById("startOverlay").classList.add("hidden");

  // Szene-Wechsel-Button sichtbar machen
  const btn = document.getElementById("nextSceneBtn");
  btn.style.opacity = "1";
  btn.style.pointerEvents = "auto";

  loadScene(0);
});

function hideSceneButton() {
  const btn = document.getElementById("nextSceneBtn");
  btn.style.opacity = "0";
  btn.style.pointerEvents = "none";
}

// SZENE WECHSELN
document.getElementById("nextSceneBtn").addEventListener("click", () => {
  sceneIndex = (sceneIndex + 1) % 3;
  loadScene(sceneIndex);
});

// Resize
window.addEventListener("resize", () => {
  if (engine) engine.resize();
});
