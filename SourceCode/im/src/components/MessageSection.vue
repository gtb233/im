<template>
    <div class="socket-right">
        <div class="socket-name">{{currentThreadName}}</div>
        <div class="socket-info"  @mouseout="isShow = false">
    
            <!--没有选中店铺时显示-->
            <div class="not-tell none">
                <span class="socket-icon"></span>您还未选中或发起聊天，快去聊一聊吧
            </div>
            <!--没有选中店铺时显示结束-->
    
            <div class="tell-list">
                <ul>
                    <message :own="message.senderUserId == currentUserId"
                        :message="message"
                        @play="play(message)"
                        v-for="(message, key) of messageList" :key="message.messageId"
                    >
                    </message>
                </ul>
            </div>
        </div>
        <div class="socket-send">
            <div class="socket-face">
                <div class="face-box" v-if="isShow">
                    <ul>
                        <li v-for="(emoji, keyid) of emojis" :key="emoji.children[0].getAttribute('name')"
                            v-html="emoji.innerHTML"
                            @click="addContent(emoji.children[0].getAttribute('name'))"
                            :title="emoji.children[0].getAttribute('name')"
                        >
                        </li>
                    </ul>
                </div>
                <span class="face socket-icon"  @click="isShow = !isShow"></span>
                <span class="price socket-icon">
                    <!-- 目前只上传图片 -->
                    <input type="file" id="img_upload" @change="sendImage()" accept=".gif,.jpg,.jpeg,.png"/>
                </span>
            </div>
            <div class="socket-input"  @mousemove="isShow = false">
                <form onsubmit="return false">
                    <textarea  v-model.trim="inputMsg" @keydown.enter.prevent.self="send()" class="input send-message" contenteditable="true">
                    </textarea>快捷发送 ENTER
                    <button @click="send()">发送</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Message from './Message.vue'
import $ from 'jquery'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
    name: "MessageSection",
    data() {
        return {
            inputMsg: '',
            isShow: false
        }
    },
    computed: {
      ...mapState({
        currentUserId: state=>state.currentUserId,
        currentThreadName : state => state.currentThreadName,
        emojis: state => state.emojis
      }),
      ...mapGetters({
        messageList: 'getCurrentUserMessage'
      })
    },
    components: {
        Message
    },
    methods: {
        send() {
            this.$store.dispatch('sendMessage', { msg: this.inputMsg })
            this.inputMsg = ''
        },
        addContent (emojiNmae) {
            this.inputMsg += emojiNmae
            this.isShow = false
        },
        play(singleMsg) {
            if (singleMsg.messageType === 'VoiceMessage') {
              this.$store.dispatch('play', { messageId: singleMsg.messageId})
            }
        },
        sendImage(){
            let _file = $("#img_upload")[0].files[0];
            this.$store.dispatch('uploadImg', { _file: _file})
        }
    },
    updated: function() {
        $(".socket-info").scrollTop($(".socket-info").scrollTop()+1000)
    }
}
</script>