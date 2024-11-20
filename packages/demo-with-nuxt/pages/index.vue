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

onMounted(async () => {
  if (!canvas.value) return;

  const scene = new Scene(
    new Map([
      [
        "cube0",
        new Block([
          new CubeMesh(
            [-1, -1, -1],
            new CubeMesh([0, 0, 0]).vertices.map(randomColor)
          ),
        ]),
      ],
      ["cube1", new Block([new CubeMesh([-0.5, -0.5, -0.5], [randomColor()])])],
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
      new SlideBlockControl((block) => {

      })
    ],
  });

  await renderedApp.value.init();
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
