import * as THREE from 'three';

/** Local 2.5D mesh animation of the supplied portrait, not a rigged 3D model. */
export function createAstronaut(stage: HTMLElement) {
  const image = stage.querySelector<HTMLImageElement>('.explorer-image')!;
  let disposed = false;
  let ready = false;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.domElement.className = 'astronaut-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1.5, -1.5, 0.1, 10);
  camera.position.z = 3;
  const geometry = new THREE.PlaneGeometry(2, 3, 40, 60);
  const positions = geometry.attributes.position;
  const original = Float32Array.from(positions.array);
  const material = new THREE.MeshBasicMaterial({ transparent: true });
  scene.add(new THREE.Mesh(geometry, material));
  let texture: THREE.Texture | undefined;
  const load = () => {
    if (disposed) return;
    new THREE.TextureLoader().load(image.currentSrc || image.src, (loaded) => {
      if (disposed) {
        loaded.dispose();
        return;
      }
      texture = loaded;
      texture.colorSpace = THREE.SRGBColorSpace;
      material.map = texture;
      material.needsUpdate = true;
      stage.append(renderer.domElement);
      stage.dataset.character = 'mesh';
      ready = true;
      render(0, 0, 0);
    });
  };
  if (image.complete) load();
  else image.addEventListener('load', load, { once: true });
  const resize = new ResizeObserver(() => {
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    const aspect = stage.clientWidth / stage.clientHeight;
    camera.left = -Math.max(1, aspect * 1.5);
    camera.right = -camera.left;
    camera.top = Math.max(1.5, 1 / aspect);
    camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  });
  resize.observe(stage);
  function render(time: number, pointerX: number, pointerY: number) {
    if (!ready || disposed) return;
    // Smooth neck-weighted nod; the feet stay anchored. No fabricated unseen surfaces.
    const angle = Math.sin(time * 0.65) * 0.022 + pointerX * 0.045;
    for (let i = 0; i < positions.count; i++) {
      const x = original[i * 3];
      const y = original[i * 3 + 1];
      const head = THREE.MathUtils.smoothstep(y, -0.1, 0.45);
      const torso = Math.exp(-Math.pow((y + 0.3) / 0.5, 2));
      const neckY = y - 0.05;
      positions.setXYZ(
        i,
        x + head * (x * Math.cos(angle) - neckY * Math.sin(angle) - x) + x * torso * Math.sin(time * 1.4) * 0.009,
        y + head * (x * Math.sin(angle) + neckY * Math.cos(angle) - neckY + pointerY * 0.022),
        0
      );
    }
    positions.needsUpdate = true;
    renderer.render(scene, camera);
  }
  return {
    render,
    dispose() {
      disposed = true;
      image.removeEventListener('load', load);
      resize.disconnect();
      texture?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete stage.dataset.character;
    },
  };
}
