/* eslint-disable no-console */
import { register } from "register-service-worker";

// Use Vite PWA plugin's auto-generated service worker
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("[PWA] New content available, please refresh.");
    // Automatically update the service worker
    updateSW(true);
  },
  onOfflineReady() {
    console.log("[PWA] App is ready for offline use.");
  },
  onRegistered(swRegistration) {
    console.log("[PWA] Service worker registered:", swRegistration);
  },
  onRegisterError(error) {
    console.error("[PWA] Service worker registration error:", error);
  },
});
