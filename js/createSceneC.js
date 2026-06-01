function createSceneC(engine) {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 1, 1); // BLAU → sofort sichtbar

  const cam = new BABYLON.FreeCamera("camC", new BABYLON.Vector3(0, 5, -10), scene);
  cam.setTarget(BABYLON.Vector3.Zero());

  new BABYLON.HemisphericLight("lightC", new BABYLON.Vector3(0, 1, 0), scene);

  BABYLON.MeshBuilder.CreateSphere("sphereC", { diameter: 3 }, scene);

  return scene;
}
