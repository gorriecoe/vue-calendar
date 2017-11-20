<template lang="pug">
    div(
        draggable="true"
        class="resize-handle"
        :class="cssClasses"
        @dragstart="dragstart"
        @dragend="dragend"
    )
</template>

<script>

export default {
    name: 'v-draggable-handle',

    props: {
        event: Object
    },

    data() {
        return {
            dragging: false
        }
    },

    methods: {
        dragstart(event) {
            this.dragging = true
            const dataTransfer = event.dataTransfer
            dataTransfer.effectAllowed = 'move';
            dataTransfer.setData('type', 'resize-end')
            dataTransfer.setData('data', JSON.stringify(this.event))
        },

        dragend(event) {
            this.dragging = false
        }
    },

    computed: {
        cssClasses() {
            return {
                dragging: this.dragging
            }
        }
    },
}
</script>

<style lang="scss">
.resize-handle{
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    -khtml-user-drag: element;
    -webkit-user-drag: element;
    cursor: ew-resize;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: block;
    width: 20px;
    height: 100%;
    &.dragging{
        cursor: grabbing;
    }
}
</style>
