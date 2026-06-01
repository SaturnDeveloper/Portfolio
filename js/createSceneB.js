function createSceneB(engine) {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.2, 0.1, 0.1, 1);

  const cam = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 5, -10), scene);
  cam.setTarget(BABYLON.Vector3.Zero());

  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  BABYLON.MeshBuilder.CreateSphere("s", { diameter: 3 }, scene);

  return scene;
}
