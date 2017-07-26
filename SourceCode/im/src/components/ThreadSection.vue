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
                <thread></thread>
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
    computed:mapState({
        userInfo: state=>state.userInfo
    }),
    components: {
        Thread,
        SearchUser,
    },
    
}
</script>
