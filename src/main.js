import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./assets/main.css";

// Register service worker for PWA support
import "./registerServiceWorker";

// Import sync utilities
import { syncUtils } from "./utils/sync";

// Set up automatic sync when coming online
window.addEventListener("online", async () => {
  console.log("[Offline Sync] Network connection restored, attempting sync...");
  try {
    const result = await syncUtils.performSync();
    console.log(
      `[Offline Sync] Sync completed: ${result.successful.length} successful, ${result.failed.length} failed`
    );

    // Dispatch a custom event for UI updates
    window.dispatchEvent(
      new CustomEvent("sync-completed", {
        detail: {
          successful: result.successful.length,
          failed: result.failed.length,
        },
      })
    );
  } catch (error) {
    console.error("[Offline Sync] Sync failed:", error);
  }
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
