<template>
    <li :class="{ own: own }">
        <span  v-html="message.content.content"></span>
        <slot></slot>
    </li>
</template>

<script>
export default {
    name: "message",
    props: {
      message: Object,
      own: Boolean
    }
}
</script>