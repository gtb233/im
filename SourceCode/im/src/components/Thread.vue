<template>
    <ul>
        <li v-for="(value, key) of userList" :key="value.targetId">
            <img class="logo" src="">
            <p class="title">店铺店铺店铺</p>
            <p class="txtle">欢迎咨询在线客服！
                <span>0</span>
            </p>
            <p class="time">2016-12-12</p>
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
