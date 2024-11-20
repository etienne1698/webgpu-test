<script setup lang="ts">
import { Scene, App, Block, CubeMesh, ClickControl, KeyboardKeyHoldControl, randomColor } from "render_engine";
import { ref, onMounted, provide } from "vue";
import type { AppProvide } from "./types";

const canvas = ref();

const scene = new Scene();

const renderedApp = ref<App>();

onMounted(async () => {
  if (!canvas.value) return;

  const scene = new Scene(
    new Map([
      ["cube0", new Block([new CubeMesh([-1, -1, -1])])],
      ["cube1", new Block([new CubeMesh([-0.5, -0.5, -0.5])])],
    ])
  );

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
    ],
  });

  await renderedApp.value.init();
  renderedApp.value.camera!.translate([0, 0, 10]);
  renderedApp.value.run();
});

provide<AppProvide>("app-provide", { renderedApp });
</script>

<template>
  <canvas ref="canvas" width="512" height="512" />
</template>

<style scoped></style>
