import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { createSkyBox } from "./skybox";

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 10;

const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener(
    "resize",
    () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
);

var light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

var plight = new THREE.PointLight(0xffffff, 10);
plight.position.set(0, 55, -20);
plight.distance = 10;
scene.add(plight);

const helper = new THREE.PointLightHelper(plight);
scene.add(helper);

const skyBox = await createSkyBox("hell", 100);

scene.add(skyBox);

const objPath = "models/skull/";
const mtlFile = "skull.mtl";
const objFile = "skull.obj";

const manager = new THREE.LoadingManager();
manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
};

const mtlLoader = new MTLLoader(manager);
const objLoader = new OBJLoader();

mtlLoader.setPath(objPath);
objLoader.setPath(objPath);

objLoader.setMaterials(await mtlLoader.loadAsync(mtlFile));
const obj = await objLoader.loadAsync(objFile);
obj.scale.setScalar(0.1);
obj.position.y = -2;
obj.position.x = -0.5;
scene.add(obj);

animate();

function animate() {
    controls.update();
    // obj.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
