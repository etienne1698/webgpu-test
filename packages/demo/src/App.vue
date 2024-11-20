<script setup lang="ts">
import { Scene, App, Block, CubeMesh } from "render_engine";
import { ref, onMounted } from "vue";

const canvas = ref();

const scene = new Scene();

console.error({ App });

onMounted(async () => {
  if (!canvas.value) return;
  console.error(canvas.value);

  const scene = new Scene(
    new Map([
      ["cube0", new Block([new CubeMesh([-1, -1, -1])])],
      ["cube1", new Block([new CubeMesh([-0.5, -0.5, -0.5])])],
    ])
  );

  const app = new App({
    scene,
    canvas: canvas.value,
    controls: [],
  });

  await app.init();
  app.camera!.translate([0, 0, 10]);
  app.run();
});
</script>

<template>
  <canvas ref="canvas" />
</template>

<style scoped></style>
