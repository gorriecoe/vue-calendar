<template lang="pug">
    div(
        draggable="true"
        class="new-event"
        :class="cssClasses"
        :style="styles"
        @dragstart="dragstart"
        @dragend="dragend"
    )
        slot
</template>

<script>
import fontColorContrast from 'font-color-contrast'

export default {
    name: 'v-new-event',

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
            dataTransfer.effectAllowed = 'copy';
            dataTransfer.setData('type', 'new')
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
        },

        styles() {
            let styles = {}

            if (this.event.color) {
                styles['background-color'] = this.event.color
                styles['color'] = fontColorContrast(this.event.color)
            }

            return styles
        }
    },
}
</script>

<style lang="scss">
.new-event{
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    -khtml-user-drag: element;
    -webkit-user-drag: element;
    cursor: grab;
    display: block;
    &.dragging{
        cursor: grabbing;
    }
}
</style>
