<template>
    <li :class="{ active: active }"
        @click="$emit('switch-thread', value.targetId, value.userName, value.userLogo)"
    >
        <img class="logo" :src="value.userLogo ? value.userLogo : './static/images/bgs/hedader-tx.png' ">
        <p class="title">{{value.userName}}</p>
        <p class="txtle">
            {{value.lastMessage}}
            <span v-bind:class="[{ isShowTips: value.messagesNumber == 0 },'']">{{value.messagesNumber}}</span>
        </p>
        <p class="time">{{value.sentTime}}</p>
    </li>
</template>

<script>
export default {
  name: 'THread',
  props: {
    value: Object,
    active: Boolean
  }
}
</script>

<style>
  .isShowTips {
      display: none;
  }
</style>
