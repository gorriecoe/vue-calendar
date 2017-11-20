<template lang="pug">
    div(
        class="event-item"
        :class="cssClasses"
        :style="styles"
        @click="$emit('click', event, $event)"
    )
        input(
            v-model="event.title"
            @blur="updateEvent(event)"
            placeholder="(no title)"
        )
</template>

<script type="text/babel">
import event from '../mixins/event'

export default {
    name: 'v-more-event',

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
    &.is-start{
        margin-left: 4px;
    }
    &.is-end{
        margin-right: 4px;
    }
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
</style>
