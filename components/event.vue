<template lang="pug">
    div(
        class="event-item"
        :class="cssClasses"
        :style="styles"
    )
        VDraggable(
            :draggable="isStart && resizeable"
            :event="event"
            type="resize-start"
            class="resize-start-handle"
        )
        VDraggable(
            :draggable="draggable"
            :event="event"
            type="move"
            class="drag-handle"
        )
            input(
                v-if="showTitle"
                v-model="event.title"
                @change="changeOccurred"
                @blur="updateEvent"
                placeholder="(no title)"
            )
        VDraggable(
            :draggable="isEnd && resizeable"
            :event="event"
            type="resize-end"
            class="resize-end-handle"
        )
</template>

<script type="text/babel">
import event from '../mixins/event'
import VDraggable from './draggable'

export default {
    name: 'v-calender-event',

    computed: {
        showTitle() {
            return (this.date.day() == this.firstDay || this.isStart)
        }
    },

    components: {
        VDraggable
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
    &.is-hidden{
        opacity: 0;
    }
    input{
        width: 100%;
        background: transparent;
        border: 0;
        color: inherit;
    }
}
.draggable{
    user-select: none;
    -khtml-user-drag: element;
    -webkit-user-drag: element;
    position: absolute;
    top: 0;
    bottom: 0;
}
.drag-handle{
    position: absolute;
    right: 10px;
    left: 10px;
    display: block;
    &,
    *{
        cursor: move;
    }
}
.resize-start-handle{
    left: 0;
    width: 10px;
    cursor: w-resize;
}

.resize-end-handle{
    right: 0;
    width: 10px;
    cursor: e-resize;
}
</style>
