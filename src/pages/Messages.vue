<template>
  <div class="messages-page">
    <MessageCenter @email-sent="showSuccess" @email-error="showError" />
  </div>
</template>

<script>
import MessageCenter from '@/components/MessageCenter.vue'

export default {
  name: 'Emails',
  components: { MessageCenter },
  methods: {
    showSuccess(message) {
      // Show success notification
      console.log('✅', message)
    },
    showError(message) {
      // Show error notification
      console.log('❌', message)
    }
  }
}
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
      console.log('✅ EMAIL SENT:', message)
    },
    showError(message) {
      console.log('❌ EMAIL ERROR:', message)
    }
  }
}
</script> -->
<style scoped>
.messages-page{
  margin-top: 50px;
}
</style>