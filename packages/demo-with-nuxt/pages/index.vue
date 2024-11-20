<script setup lang="ts">
import {
  Scene,
  App,
  Block,
  CubeMesh,
  ClickControl,
  KeyboardKeyHoldControl,
  randomColor,
  colors,
  SlideBlockControl,
} from "render_engine";
import { ref, onMounted, provide } from "vue";
import type { AppProvide } from "../types";

const canvas = ref();

const renderedApp = ref<App>();

function generateRandomCubes(
  scene: Scene,
  N: number,
  bounds: { x: number; y: number; z: number }
) {
  for (let i = 0; i < N; i++) {
    const position = [
      Math.random() * bounds.x - bounds.x / 2, // Position X aléatoire
      Math.random() * bounds.y - bounds.y / 2, // Position Y aléatoire
      Math.random() * bounds.z - bounds.z / 2, // Position Z aléatoire
    ];
    const color = randomColor();
    const cubeMesh = new CubeMesh(position as CubeMesh["vertices"][0], [color]);
    const block = new Block([cubeMesh]);
    scene.addBlock(`cube${i + 1}`, block);
  }
}

onMounted(async () => {
  if (!canvas.value) return;

  const scene = new Scene(new Map([]));

  renderedApp.value = new App({
    scene,
    canvas: canvas.value,
    controls: [
      new ClickControl((block) => {
        block.meshes[0].colors = new CubeMesh([0, 0, 0]).vertices.map(
          randomColor
        );
      }),
      new KeyboardKeyHoldControl(KeyboardKeyHoldControl.DEFAULT_KEY_BINDING),
      new SlideBlockControl((block) => {}),
    ],
  });

  await renderedApp.value.init();
  generateRandomCubes(renderedApp.value.scene, 15, { x: 10, y: 10, z: 10 });
  renderedApp.value.camera!.translate([0, 0, 10]);
  renderedApp.value.run();
});

provide<AppProvide>("app-provide", { renderedApp });
</script>

<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex-1 w-full flex">
      <div />
      <canvas ref="canvas" class="h-full w-full" />
      <div />
    </div>
  </div>
</template>

<style scoped></style>
