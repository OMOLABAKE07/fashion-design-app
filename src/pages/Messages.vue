<template>
  <div class="messages-page">
    <MessageCenter @email-sent="showSuccess" @email-error="showError" />
  </div>
</template>

<script>
import MessageCenter from "@/components/MessageCenter.vue";

export default {
  name: "Emails",
  components: { MessageCenter },
  methods: {
    showSuccess(message) {},
    showError(message) {},
  },
};
</script>
<!-- 
<script>
import MessageCenter from '@/components/MessageCenter.vue'
import { syncUtils } from '@/utils/sync.js'

export default {
  name: 'Message',
  components: { MessageCenter },
  async mounted() {
    // Auto-sync when page loads
    await syncUtils.syncAll()
  },
  methods: {
    showSuccess(message) {
    },
    showError(message) {
    }
  }
}
</script> -->
<style scoped>
.messages-page {
  margin-top: 50px;
}
</style>
