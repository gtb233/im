<template>
			<div class="socket-box">
          <thread-section></thread-section>
          <message-section></message-section>
			</div>
</template>

<script>
import ThreadSection from '../components/ThreadSection.vue'
import MessageSection from '../components/MessageSection.vue'
export default {
    name:"Index",
    components:{
      ThreadSection,
      MessageSection
    }
}
</script>

