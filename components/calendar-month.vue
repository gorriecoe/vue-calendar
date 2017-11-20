<template lang="pug">
    div(class="calendar")
        v-navigator(
            :current-month="currentMonth"
            :first-day="firstDay"
            :locale="locale"
            :showYearNavigator="showYearNavigator"
            @change="updateMonth"
        )
        div(class="month-view")
            div(class="month-header")
                div(class="week-row")
                    span(
                        class="day-header"
                        aria-hidden="true"
                        v-for="dayIndex in 7"
                    )
                        | {{ localeWeekDay(dayIndex - 1) }}
            div(class="month-body")
                div(
                    class="dates-events"
                    ref="dates"
                )
                    div(
                        class="week-row"
                        v-for="week in currentDates"
                    )
                        div(
                            class="day-cell"
                            v-for="(day, index) in week"
                            :data-timestamp="day.timestamp"
                            :class="{'today' : day.isToday, 'other-month' : !day.isCurrentMonth, 'current' : day.isCurrentDay, 'past' : day.isPast, 'future' : day.isFuture}"
                            droppable="true"
                            @dragenter="dragenter"
                            @dragleave="dragleave"
                            @dragover="dragover"
                            @drop="drop"
                            @click.stop="updateDay(day, $event)"
                        )
                            span(
                                class="day-number"
                                aria-hidden="true"
                                v-text="day.monthDay"
                            )
                                | {{ day.monthDay }}
                            div(class="event-box")
                                v-event(
                                    :date="day.date"
                                    :firstDay="firstDay"
                                    v-for="event in day.events"
                                    :event="event"
                                    :key="event.cellIndex"
                                    v-show="event.cellIndex <= eventLimit"
                                    @click="selectEvent(event, $event)"
                                    @update-event="updateEvent"
                                )
                                    template(slot-scope="p")
                                        slot(
                                            name="event-card"
                                            :event="p.event"
                                        )
                                p(
                                    v-if="day.events.length > eventLimit"
                                    class="more-link"
                                    @click.stop="showMore(day, $event)"
                                )
                                    | {{ day.events[day.events.length -1].cellIndex - eventLimit }} more
                div(
                    class="more-events"
                    v-show="more"
                    :style="{left: morePos.left + 'px', top: morePos.top + 'px'}"
                )
                    div(class="more-header")
                        span(
                            class="title"
                            v-text="moreTitle"
                        )
                        span(
                            class="close"
                            @click.stop="closeMore($event)"
                        )
                            | x
                    div(class="more-body")
                        v-event(
                            :date="selectDay.date"
                            firstDay="true"
                            v-for="event in selectDay.events"
                            :event="event"
                            :key="event.cellIndex"
                            @click="selectEvent(event, $event)"
                            @update-event="updateEvent"
                        )
</template>

<script type="text/babel">
import moment from 'moment'
import VEvent from './event'
import Month from '../mixins/month'

export default {
    name: 'v-calendar-month',

    props: {
        events: { // events will be displayed on calendar
            type: Array,
            default: []
        },
        editable: Boolean
    },

    data() {
        return {
            eventLimit: 3,
            more: false,
            morePos: {
                top: 0,
                left: 0
            },
            temporaryEvent: null
        }
    },

    computed: {
        moreTitle() {
            if (!this.selectDay.date) return ''
            return this.selectDay.date.format('ll')
        }
    },

    methods : {
        getCalendar() {
            let monthViewStartDate = this.getMonthViewStartDate(this.currentMonth, this.firstDay)
            let calendar = []

            for(let perWeek = 0; perWeek < 6; perWeek++) {
                let week = []

                for(let perDay = 0; perDay < 7; perDay++) {
                    let diffToday = monthViewStartDate.diff(moment().startOf('day'), 'day')
                    week.push({
                        monthDay: monthViewStartDate.date(),
                        isToday: diffToday == 0,
                        isPast: diffToday < 0,
                        isFuture: diffToday > 0,
                        isCurrentDay: monthViewStartDate.isSame(this.currentDay, 'day'),
                        isCurrentMonth: monthViewStartDate.isSame(this.currentMonth, 'month'),
                        weekDay: perDay,
                        date: moment(monthViewStartDate),
                        timestamp: moment(monthViewStartDate).format('X'),
                        events: this.slotEvents(monthViewStartDate)
                    });
                    monthViewStartDate.add(1, 'day')
                }

                calendar.push(week)
            }

            return calendar
        },

        slotEvents(date) {
            // find all events start from this date
            let cellIndexArr = [];
            let thisDayEvents = this.events.filter(day => {
                let start = moment(day.start)
                let end = moment(day.end ? day.end : start)

                return date.isBetween(start, end, null, '[]')
            })

            // sort by duration
            thisDayEvents.sort((a, b) => {
                if(!a.cellIndex) return 1
                if (!b.cellIndex) return -1
                return a.cellIndex - b.cellIndex
            })

            // mark cellIndex and place holder
            for (let i = 0; i < thisDayEvents.length; i++) {
                thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || (i + 1)
                thisDayEvents[i].isShow = true
                if (thisDayEvents[i].cellIndex == i + 1 || i > 2) continue
                thisDayEvents.splice(i, 0,{
                    title: 'holder',
                    cellIndex: i + 1,
                    start: date.format(),
                    end: date.format(),
                    isShow: false
                })
            }

            return thisDayEvents
        },

        showMore(day, DOMevent) {
            this.selectDay = day
            this.more = true
            this.morePos = this.computePos(DOMevent.target)
            this.morePos.top -= 100
            let events = day.value.filter(item => {
                return item.isShow == true
            })
            this.$emit('day-more', day.date, events, DOMevent)
        },

        closeMore(DOMevent) {
            let day = this.selectDay
            this.more = false
            this.$emit('day-close', this.selectDay.date, DOMevent)
        },

        computePos(target) {
            let eventRect = target.getBoundingClientRect()
            let calendarRect = this.$refs.dates.getBoundingClientRect()
            return {
                left: eventRect.left - calendarRect.left,
                top: eventRect.top + eventRect.height - calendarRect.top
            }
        },

        selectEvent(event, DOMevent) {
            if (!event.isShow) return
            let position = this.computePos(DOMevent.target)
            this.$emit('select-event', event, DOMevent, position)
        },

        dragenter(DOMevent) {
        },

        dragleave(DOMevent) {
        },

        dragover(DOMevent) {
            if (DOMevent.preventDefault) DOMevent.preventDefault()

            var type = DOMevent.dataTransfer.getData('type')
            var data = JSON.parse(DOMevent.dataTransfer.getData('data'))
            var date = moment(DOMevent.target.dataset.timestamp, ['X'])
            switch (type) {
                case 'new':
                    data.start = date
                    data.end = date.add(data.duration, 'days')
                    break
                case 'move':
                    let originalStart = moment(data.start)
                    let originalEnd = moment(data.end)
                    let difference = originalEnd.diff(originalStart, 'days')
                    data.start = date
                    data.end = date.add(difference, 'days')
                    break
                case 'resize-start':
                    if (date.isBefore(data.end)) {
                        data.start = date
                    }
                    break
                case 'resize-end':
                    if (date.isAfter(data.start) || date.isSame(data.start)) {
                        data.end = date
                    }
                    break
            }
            this.temporaryEvent = data
        },

        drop(DOMevent) {
            if (DOMevent.preventDefault) DOMevent.preventDefault()

            var type = DOMevent.dataTransfer.getData('type')
            var data = JSON.parse(DOMevent.dataTransfer.getData('data'))
            var date = moment(DOMevent.target.dataset.timestamp, ['X'])
            switch (type) {
                case 'new':
                    data.start = date
                    data.end = date.add(data.duration, 'days')
                    this.$emit('new-event', data)
                    break
                case 'move':
                    let originalStart = moment(data.start)
                    let originalEnd = moment(data.end)
                    let difference = originalEnd.diff(originalStart, 'days')
                    data.start = date
                    data.end = date.add(difference, 'days')
                    this.updateEvent(data)
                    break
                case 'resize-start':
                    if (date.isBefore(data.end)) {
                        data.start = date
                        this.updateEvent(data)
                    }
                    break
                case 'resize-end':
                    if (date.isAfter(data.start) || date.isSame(data.start)) {
                        data.end = date
                        this.updateEvent(data)
                    }
                    break
            }
        },

        updateEvent(event) {
            if (!moment.isMoment(event.start)) {
                event.start = moment(event.start)
            }
            if (!moment.isMoment(event.end)) {
                event.end = moment(event.end)
            }
            this.$emit('update-event', event)
        }
    },

    mixins: [
        Month
    ],

    components: {
        VEvent
    }
}

</script>
<style lang="scss" scoped>
.calendar{
    ul,
    p{
        margin: 0;
        padding: 0;
    }
}
.month-header,
.month-body {
    position: relative;
}
.dates-events{
    display: flex;
    flex-direction: column;
    height: 500px;
}
.week-row{
    width: 100%;
    display: flex;
    flex: 1 1 0%;
}
.day-header,
.day-cell {
    position: relative;
    flex: 1 1 0%;
}
.day-number{
    display: block;
}
.more-link{
    cursor: pointer;
}
.more{
    &-events{
        position:absolute;
        width: 300px;
        z-index: 2;
        background-color: #fff;
    }
    &-header{
        padding: 5px;
        display: flex;
        align-items : center;
        font-size: 14px;
        .title{
            flex: 1;
        }
        .close{
            margin-right: 2px;
            cursor: pointer;
            font-size: 16px;
        }
    }
    &-body{
        height: 146px;
        overflow: hidden;
    }
}
.body{
    &-list{
        height: 144px;
        padding: 5px;
        overflow: auto;
    }
    &-item{
        cursor: pointer;
        font-size: 12px;
        margin-bottom: 2px;
        padding: 0 0 0 4px;
        height: 18px;
        line-height: 18px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
