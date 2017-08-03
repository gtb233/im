<template>
    <div class="socket-right">
        <div class="socket-name">店铺一</div>
        <div class="socket-info">
    
            <!--没有选中店铺时显示-->
            <div class="not-tell none">
                <span class="socket-icon"></span>您还未选中或发起聊天，快去聊一聊吧
            </div>
            <!--没有选中店铺时显示结束-->
    
            <div class="tell-list">
                <ul>
                    <message></message>
                </ul>
            </div>
    
        </div>
        <div class="socket-send">
            <div class="socket-face">
                <div class="face-box">
                    <ul>
    
                    </ul>
                </div>
                <span class="face socket-icon"></span>
                <span class="price socket-icon">
                    <input type="file" id="img_upload" />
                </span>
            </div>
            <div class="socket-input">
                <form onsubmit="return false">
                    <!-- <div class="input" contenteditable="true" >{{inputMsg}}</div> -->
                    <textarea v-model="inputMsg" ></textarea>
                    <button @click="send()">发送</button>
                </form>
            </div>
    
        </div>
    </div>
</template>

<script>
import Message from './Message.vue'
import { mapActions } from 'vuex'
export default {
    name: "MessageSection",
    data() {
        return {
            inputMsg: '',
        }
    },
    components: {
        Message
    },
    methods: {
        send() {
            console.log(this.inputMsg)
            this.$store.dispatch('sendMessage', { msg: this.inputMsg })
            this.inputMsg = ''
        }
    }
}
</script>