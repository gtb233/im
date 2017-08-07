<template>
    <div class="socket-left">
        <!-- 用户信息 -->
        <div class="socket-logo">
            <img :src="userInfo.thumb">
            <p class="name"> {{ userInfo.username }} </p>
            <p class="grade">
                <i class="socket-icon"></i>{{userInfo.userLevel}}
            </p>
        </div>

        <!-- 搜索会话用户 -->
        <search-user></search-user>
            
        <div class="socket-list">
            <ul>
                <thread :active="value.active == 'active'"
                        :value="value"
                        @switch-thread="navClickEvent(value.targetId)"
                        v-for="(value, key) of userList" :key="value.messageId">
                </thread>
            </ul>
        </div>
    </div>
</template>

<script>
import Thread from './Thread.vue'
import SearchUser from './SearchUser.vue'
import { mapGetters,mapState } from 'vuex'

export default {
    name: "threadSection",
    computed: {
      ...mapState({
        userInfo: state=>state.userInfo,
        userList: state => state.userList
      })
    },
    components: {
        Thread,
        SearchUser,
    },
    methods: {
      navClickEvent: function(targetId) {
        //变更聊天窗显示数据
        this.$store.dispatch('changeCurrentThreadID', { 'targetId': targetId })
        //变更列表数据，DON处理

        console.log(targetId)
      }
    }
}
</script>
