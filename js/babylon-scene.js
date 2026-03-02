// js/babylon-scene.js
(() => {
  window.addEventListener("load", () => {
    const canvas = document.getElementById("renderCanvas");
    if (!canvas) return;

    if (!window.BABYLON) {
      console.error("Babylon.js fehlt. Prüfe <script src='https://cdn.babylonjs.com/babylon.js'>");
      return;
    }

    const engine = new BABYLON.Engine(canvas, true, { adaptToDeviceRatio: true });

    // --- Scene ---
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.03, 0.03, 0.05, 1);

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
      "cam",
      -Math.PI / 2,
      Math.PI / 3.2,
      18,
      new BABYLON.Vector3(0, 3, 0),
      scene
    );
    camera.attachControl(canvas, false);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 28;
    camera.panningSensibility = 0;

    // Light
    const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    hemi.intensity = 0.9;

    const dir = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(-0.4, -1, -0.2), scene);
    dir.position = new BABYLON.Vector3(12, 18, 10);
    dir.intensity = 1.0;

    // Materials
    const groundMat = new BABYLON.StandardMaterial("gMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.07, 0.07, 0.10);
    groundMat.specularColor = new BABYLON.Color3(0, 0, 0);

    const wallMat = new BABYLON.StandardMaterial("wMat", scene);
    wallMat.diffuseColor = new BABYLON.Color3(0.14, 0.14, 0.20);

    const ballMat = new BABYLON.StandardMaterial("bMat", scene);
    ballMat.diffuseColor = new BABYLON.Color3(0.45, 0.35, 1.0);
    ballMat.emissiveColor = new BABYLON.Color3(0.03, 0.02, 0.08);
    ballMat.specularColor = new BABYLON.Color3(0.9, 0.9, 1.0);
    ballMat.specularPower = 64;

    // Ground (named for raycast)
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 70, height: 40 }, scene);
    ground.material = groundMat;

    // Back wall
    const wall = BABYLON.MeshBuilder.CreateBox("wall", { width: 32, height: 10, depth: 1 }, scene);
    wall.position.set(0, 5, 14);
    wall.material = wallMat;

    // Side rails
    const sideL = BABYLON.MeshBuilder.CreateBox("sideL", { width: 1, height: 6, depth: 28 }, scene);
    sideL.position.set(-16, 3, 2);
    sideL.material = wallMat;

    const sideR = BABYLON.MeshBuilder.CreateBox("sideR", { width: 1, height: 6, depth: 28 }, scene);
    sideR.position.set(16, 3, 2);
    sideR.material = wallMat;

    // Targets from PROJECTS
    const projects = (window.PROJECTS || []).slice(0, 6);
    const targets = [];

    function makeTargetMat(i) {
      const m = new BABYLON.StandardMaterial("tMat" + i, scene);
      m.diffuseColor = new BABYLON.Color3(0.18 + 0.05 * i, 0.12 + 0.03 * i, 0.28 + 0.04 * i);
      m.emissiveColor = new BABYLON.Color3(0.02, 0.01, 0.04);
      return m;
    }

    const cols = Math.min(3, Math.max(1, projects.length || 3));
    const startX = -(cols - 1) * 4 * 0.5;
    const startY = 2.0;

    const targetCount = projects.length ? projects.length : 6;

    for (let i = 0; i < targetCount; i++) {
      const p = projects[i] || { id: "demo-" + i, title: "Demo " + i };

      const c = i % cols;
      const r = Math.floor(i / cols);

      const box = BABYLON.MeshBuilder.CreateBox("target_" + p.id, { width: 2.2, height: 2.2, depth: 0.8 }, scene);
      box.position.set(startX + c * 4, startY + r * 3, 10);
      box.material = makeTargetMat(i);

      box.metadata = {
        projectId: p.id,
        hit: false,
        falling: false,
        fallT: 0
      };

      targets.push(box);

      const stand = BABYLON.MeshBuilder.CreateBox("stand_" + p.id, { width: 2.6, height: 0.4, depth: 1.2 }, scene);
      stand.position.set(box.position.x, box.position.y - 1.5, box.position.z);
      stand.material = wallMat;
    }

    // Projectiles (no physics)
    const balls = [];
    let lastShotAt = 0;

    function openProject(id) {
      if (typeof window.openProjectById === "function") {
        window.openProjectById(id);
      }
    }

    // NEW: aim ray from mouse position (pointerX/Y)
    function getAimRay() {
      return scene.createPickingRay(
        scene.pointerX,
        scene.pointerY,
        BABYLON.Matrix.Identity(),
        camera
      );
    }

    // NEW: try to aim at ground point; fallback to ray direction
    function getAimDirection() {
      const pick = scene.pick(
        scene.pointerX,
        scene.pointerY,
        (m) => m === ground
      );

      if (pick && pick.hit && pick.pickedPoint) {
        return pick.pickedPoint.subtract(camera.position).normalize();
      }

      const ray = getAimRay();
      return ray.direction.normalize();
    }

    function shootBall() {
      const now = performance.now();
      if (now - lastShotAt < 130) return;
      lastShotAt = now;

      const dir = getAimDirection();

      // spawn slightly in front of camera along aim direction
      const spawnPos = camera.position.add(dir.scale(1.8));

      const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 0.55, segments: 16 }, scene);
      ball.position.copyFrom(spawnPos);
      ball.material = ballMat;

      const speed = 26;
      balls.push({
        mesh: ball,
        vel: dir.scale(speed),
        life: 0
      });

      // cleanup
      if (balls.length > 40) {
        const old = balls.shift();
        old.mesh.dispose();
      }
    }

    // Input: click/tap shoots where mouse points
    scene.onPointerObservable.add((pi) => {
      if (pi.type === BABYLON.PointerEventTypes.POINTERDOWN) shootBall();
    });

    // Update loop
    const gravity = new BABYLON.Vector3(0, -18, 0);
    const ballRadius = 0.275;
    const targetRadius = 1.35;

    scene.onBeforeRenderObservable.add(() => {
      const dt = engine.getDeltaTime() * 0.001;

      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        b.life += dt;

        b.vel.addInPlace(gravity.scale(dt));
        b.mesh.position.addInPlace(b.vel.scale(dt));

        // ground bounce
        if (b.mesh.position.y < ballRadius) {
          b.mesh.position.y = ballRadius;
          b.vel.y *= -0.45;
          b.vel.x *= 0.92;
          b.vel.z *= 0.92;
        }

        // remove old
        if (b.life > 6 || b.mesh.position.length() > 120) {
          b.mesh.dispose();
          balls.splice(i, 1);
          continue;
        }

        // hit test
        for (const t of targets) {
          if (t.metadata.hit) continue;

          const d = BABYLON.Vector3.Distance(b.mesh.position, t.position);
          if (d < (ballRadius + targetRadius)) {
            t.metadata.hit = true;
            t.metadata.falling = true;
            t.metadata.fallT = 0;

            // remove ball
            b.mesh.dispose();
            balls.splice(i, 1);

            openProject(t.metadata.projectId);
            break;
          }
        }
      }

      // target fall animation
      for (const t of targets) {
        if (!t.metadata.falling) continue;

        t.metadata.fallT += dt;
        const tt = Math.min(1, t.metadata.fallT / 0.9);

        t.rotation.x = -tt * 1.2;
        t.position.y -= dt * 0.5;
        t.position.z += dt * 0.4;

        if (tt >= 1) t.metadata.falling = false;
      }
    });

    // Optional overlay buttons (if present)
    const resetBtn = document.getElementById("resetScene");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        targets.forEach((t, idx) => {
          const c = idx % cols;
          const r = Math.floor(idx / cols);
          t.position.set(startX + c * 4, startY + r * 3, 10);
          t.rotation.set(0, 0, 0);
          t.metadata.hit = false;
          t.metadata.falling = false;
          t.metadata.fallT = 0;
        });
        balls.forEach(b => b.mesh.dispose());
        balls.length = 0;
      });
    }

    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());
  });
})();
