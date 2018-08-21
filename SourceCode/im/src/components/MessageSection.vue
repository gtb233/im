<template>
    <div class="socket-right">
        <div class="socket-right" v-bind:class="[{ isShowMsgSection: currentThreadID !== currentUserId},'']">
            <div class="tips">{{tipsMessage}}</div>
        </div>
        <div class="socket-right" v-bind:class="[{ isShowMsgSection: currentThreadID === currentUserId},'']">
            <div class="socket-name">
                <span class="socket-shop-logo">
                    <img class="socket-shop-logo" :src="currentThreadLogo ? currentThreadLogo : './static/images/bgs/hedader-tx.png' ">
                </span>
                {{currentThreadName}}
            </div>
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
                            v-for="message of messageList" :key="message.messageUId + message.uniKey"
                        >
                        </message>
                    </ul>
                </div>
            </div>
            <div class="socket-send">
                <div class="socket-face">
                    <div class="face-box" v-if="isShow">
                        <ul>
                            <li v-for="emoji of emojis" :key="emoji.children[0].getAttribute('name')"
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
                        <input type="file" class="fileInput" id="img_upload" @change="sendImage()" accept=".gif,.jpg,.jpeg,.png"/>
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
        currentThreadID: state => state.currentThreadID,
        currentThreadName: state => state.currentThreadName,
        currentThreadLogo: state => state.currentThreadLogo,
        tipsMessage: state => state.tipsMsg,
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
            let _file = $("#img_upload")[0].files[0]; // 不支持IE10以下版本
            /* let types = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/x-png']
            if (types.indexOf(_file.type) == -1) {
                alert('请上传图片文件！')
                return false
            } */
            this.$store.dispatch('uploadImg', { _file: _file})
        }
    },
    updated: function() {
        setTimeout(()=>{
            $(".socket-info").scrollTop($(".socket-info").scrollTop()+1000)
        },300);
    }
}
</script>

<style>
  .isShowMsgSection {
    display: none;
  }
  .tips{
    margin: 25% 0 0 25%;
    font-size: 18px;
  }
</style>