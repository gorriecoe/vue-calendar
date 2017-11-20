import moment from 'moment'
import fontColorContrast from 'font-color-contrast'

export default {
    name: 'v-calender-event',

    props: {
        event: Object,
        date: Object,
        firstDay: [Number, String],
        draggable: {
            type: Boolean,
            default: true
        }

    },

    data() {
        return {
            changed: false
        }
    },

    methods: {
        dragstart(event) {
            this.dragging = true
            const dataTransfer = event.dataTransfer
            dataTransfer.effectAllowed = 'move';
            dataTransfer.setData('type', 'move')
            dataTransfer.setData('data', JSON.stringify(this.event))
        },

        dragend(event) {
            if (this.draggable) {
                this.dragging = false
            }
        },

        selectEvent(event) {
            this.$emit('select-event', this.event, event)
        },

        updateEvent(event) {
            if (this.changed) {
                this.changed = false
                this.$emit('update-event', this.event)
            }
        },

        changeOccurred(event) {
            this.changed = true
        }
    },

    computed: {
        cssClasses() {
            let classes = this.event.cssClass

            if (!Array.isArray(classes)) {
                classes = [classes]
            } else {
                classes = Array.from(classes)
            }

            if (this.isStart) {
                classes.push('is-start')
            }

            if (this.isEnd) {
                classes.push('is-end')
            }

            if (!this.event.isShow) {
                classes.push('is-opacity')
            }

            return classes
        },

        styles() {
            let styles = {}

            if (this.event.color) {
                styles['background-color'] = this.event.color
                styles['color'] = fontColorContrast(this.event.color)
            }

            return styles
        },

        start() {
            return moment(this.event.start)
        },

        isStart() {
            return this.start.isSame(this.date, 'day')
        },

        end() {
            return moment(this.event.end)
        },

        isEnd() {
            return this.end.isSame(this.date, 'day')
        }
    }
}
