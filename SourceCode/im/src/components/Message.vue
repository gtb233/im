<template>
    <li :class="{ own: own }">
        <span>{{message.content.content}}</span>
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