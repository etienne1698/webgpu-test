import { App } from "render_engine";
import type { Ref } from "vue";

export type AppProvide = {
  renderedApp: Ref<App | undefined>;
};
