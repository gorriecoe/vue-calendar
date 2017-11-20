<template lang="pug">
    div(
        :draggable="draggable"
        class="draggable"
        :class="{dragging: this.dragging}"
        @dragstart="dragstart"
        @dragend="dragend"
    )
        slot
</template>

<script>

export default {
    name: 'v-draggable',

    props: {
        draggable: {
            type: Boolean,
            default: true
        },
        event: Object,
        type: String
    },

    data() {
        return {
            dragging: false
        }
    },

    methods: {
        dragstart(DOMevent) {
            this.dragging = true
            const dataTransfer = DOMevent.dataTransfer
            dataTransfer.effectAllowed = 'move';
            dataTransfer.setData('type', this.type)
            dataTransfer.setData('data', JSON.stringify(this.event))
        },

        dragend(DOMevent) {
            this.dragging = false
        }
    }
}
</script>
