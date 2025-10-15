<template>
  <div class="messages-page">
    <MessageCenter @view-customer="handleViewCustomer" />
  </div>
</template>

<script>
import MessageCenter from '@/components/MessageCenter.vue'

export default {
  name: 'Messages',
  components: {
    MessageCenter
  },
  methods: {
    handleViewCustomer(customer) {
      console.log('View customer:', customer)
      // Navigate to customers page or open customer details
      this.$router.push('/customers')
    }
  }
}
</script>

<style scoped>
.messages-page {
  height: 100vh;
  overflow: hidden;
}
</style>