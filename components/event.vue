<template lang="pug">
    div(
        class="event-item"
        :class="cssClasses"
        :style="styles"
        @click="selectEvent"
    )
        div(
            class="drag-handle"
            :draggable="draggable"
            @dragstart="dragstart"
            @dragend="dragend"
        )
            input(
                v-if="showTitle"
                v-model="event.title"
                @change="changeOccurred"
                @blur="updateEvent(event)"
                placeholder="(no title)"
            )
        v-draggable-handle(
            v-if="isEnd && resizeable"
            :event="event"
        )
</template>

<script type="text/babel">
import event from '../mixins/event'
import draggableHandle from './draggable-handle'

export default {
    name: 'v-calender-event',

    props: {
        resizeable: {
            type: Boolean,
            default: true
        }
    },

    computed: {
        showTitle() {
            return (this.date.day() == this.firstDay || this.isStart)
        }
    },

    components: {
        'v-draggable-handle': draggableHandle
    },

    mixins: [
        event
    ]
}
</script>

<style lang="scss">
.event-item{
    height: 18px;
    line-height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    &.is-opacity{
        opacity: 0;
    }
    input{
        cursor: grab;
        width: 100%;
        background: transparent;
        border: 0;
        color: inherit;
    }
}
.drag-handle{
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    -khtml-user-drag: element;
    -webkit-user-drag: element;
    cursor: grab;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    &.dragging{
        cursor: grabbing;
    }
}
</style>
