import "./styles.css";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  BoxGeometry,
  PointLight,
  AxesHelper,
  PointLightHelper,
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper
} from "three";
import { OrbitControls } from "three-addons";
import { Stats } from "three-stats";

import { useEffect } from "react";
export default function App() {
  const init = () => {
    console.log("init");
    // 场景
    const scene = new Scene();
    // 几何体
    const geometry = new BoxGeometry(10, 10, 10);
    // 材质（不受光源影响）
    const material = new MeshBasicMaterial({
      color: 0xff0000 //0xff0000设置材质颜色为红色
    });
    // 材质（受光源影响）
    const material1 = new MeshLambertMaterial({
      color: 0x00ff00
    });
    // 网格：什么形状，什么材质
    const mesh = new Mesh(geometry, material);
    const mesh1 = new Mesh(geometry, material1);
    mesh.position.set(50, 50, 0);
    mesh1.position.set(0, 50, 50);
    scene.add(mesh, mesh1);
    // 摄像机
    const width = window.innerWidth; //窗口文档显示区的宽度作为画布宽度
    const height = window.innerHeight; //窗口文档显示区的高度作为画布高度
    const camera = new PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.set(100, 100, 100);
    camera.lookAt(20, 20, 20);

    // 光源（点光源）
    const pointLight = new PointLight(0xffffff, 1.0);
    scene.add(pointLight);
    pointLight.position.set(100, 60, 50);
    // 点光源提示
    const pointLightHelper = new PointLightHelper(pointLight, 10);
    scene.add(pointLightHelper);
    // 环境光
    const ambient = new AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    // 平行光
    const directionalLight = new DirectionalLight(0x00ffff, 1);
    // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
    directionalLight.position.set(80, 100, 50);
    // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
    directionalLight.target = mesh;
    scene.add(directionalLight);
    // 平行光辅助
    const dirLightHelper = new DirectionalLightHelper(
      directionalLight,
      5,
      0xff0000
    );
    scene.add(dirLightHelper);

    // 渲染器
    const renderer = new WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比
    renderer.setClearColor(0x444444, 1); //设置背景颜色

    // 轴提示
    const axesHelper = new AxesHelper(150);
    axesHelper.position.set(20, 20, 20);
    scene.add(axesHelper);

    document.getElementById("box")?.appendChild(renderer.domElement);
    renderer.render(scene, camera);

    // 设置相机控件轨道控制器OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    controls.addEventListener("change", function () {
      renderer.render(scene, camera); //执行渲染操作
    });

    // 显示帧率
    const stats = new Stats();
    document.body.appendChild(stats.domElement);

    // 双层for循环创建阵列模型
    //材质对象Material
    const material2 = new MeshLambertMaterial({
      color: 0x00ffff, //设置材质颜色
      transparent: true, //开启透明
      opacity: 0.5 //设置透明度
    });
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const mesh = new Mesh(geometry, material2); //网格模型对象Mesh
        // 在XOZ平面上分布
        mesh.position.set(i * 200, 0, j * 200);
        scene.add(mesh); //网格模型添加到场景中
      }
    }

    // 设置动画
    function render() {
      stats.update();
      renderer.render(scene, camera); //执行渲染操作
      mesh.rotateY(0.01); //每次绕y轴旋转0.01弧度
      requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
    }
    render();
  };
  useEffect(() => {
    init();
  }, []);
  return <div id="box" />;
}
