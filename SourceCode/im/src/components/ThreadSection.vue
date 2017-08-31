<template>
    <div class="socket-left">
        <!-- 用户信息 -->
        <div class="socket-logo">
            <img :src="userInfo.thumb ? userInfo.thumb : './static/images/bgs/hedader-tx.png' ">
            <p class="name"> {{ userInfo.username }} </p>
            <p class="grade">
                <i class="socket-icon"></i>{{userInfo.userLevel}}
            </p>
        </div>

        <!-- 搜索会话用户 -->
        <!-- <search-user></search-user> -->
        <div class="socket-search">
            <input v-model.trim="searchName" type="text" name="">
            <button class="socket-icon"></button>
        </div>

        <div class="socket-list">
            <ul>
                <thread :active="value.active == 'active'"
                        :value="value"
                        @switch-thread="navClickEvent(value.targetId, value.userName, value.userLogo)"
                        v-for="(value, key) of userList" :key="value.messageId">
                </thread>
            </ul>
        </div>
    </div>
</template>

<script>
import Thread from './Thread.vue'
import { mapGetters,mapState } from 'vuex'

export default {
    name: "threadSection",
    data () {
      return {
        searchName: ''
      }
    },
    computed: {
      ...mapGetters({
        userList: 'getUserList'
      }),
      ...mapState({
        userInfo: state=>state.userInfo
      })
    },
    watch: {
        searchName: function (val) {
          this.$store.dispatch('changeSearchName', { 'val': val })
        }
    },
    components: {
        Thread
    },
    methods: {
      navClickEvent: function(targetId, userName, userLogo) {
        //变更聊天窗显示数据
        this.$store.dispatch('changeCurrentThreadID', {
            'targetId': targetId,
            'userName': userName,
            'userLogo': userLogo
            })
      }
    }
}
</script>
