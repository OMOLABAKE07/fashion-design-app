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