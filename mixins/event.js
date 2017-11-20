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
        },
        resizeable: {
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
        dragstart(DOMevent) {
            this.dragging = true
            let dataTransfer = DOMevent.dataTransfer
            dataTransfer.effectAllowed = 'move';
            dataTransfer.setData('type', 'move')
            dataTransfer.setData('data', JSON.stringify(this.event))
        },

        dragend(DOMevent) {
            if (this.draggable) {
                this.dragging = false
            }
        },

        updateEvent(DOMevent) {
            if (this.changed) {
                this.changed = false
                this.$emit('update-event', this.event, DOMevent)
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
                classes.push('is-hidden')
            }

            return classes
        },

        styles() {
            let styles = {}

            if (this.event.color) {
                let color = this.event.color
                if (typeof color === 'string') {
                    styles['background-color'] = color
                    styles['color'] = fontColorContrast(color)
                } else {
                    styles['background-color'] = color.background
                    styles['color'] = color.text
                }
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
