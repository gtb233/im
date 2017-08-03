<template>
    <ul>
        <li v-for="(value, key) of userList" :key="value.targetId">
            <img class="logo" :src="value.userLogo">
            <p class="title">{{value.userName}}</p>
            <p class="txtle">
                {{value.lastMessage}}
                <span>{{value.messagesNumber}}</span>
            </p>
            <p class="time">{{value.sentTime}}</p>
        </li>
    </ul>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      userList: state => state.userList
    }),
  }
}
</script>

<style>
  
</style>
