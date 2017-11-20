<template lang="pug">
    div(class="calendar mini")
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
                        class="day-cell"
                        aria-hidden="true"
                        v-for="dayIndex in 7"
                    )
                        | {{ localeWeekDay(dayIndex - 1) }}
            div(
                class="month-body"
                ref="dates"
            )
                div(
                    class="week-row"
                    v-for="week in currentDates"
                )
                    div(
                        class="day-cell"
                        v-for="(day, index) in week"
                        :timestamp="day.timestamp"
                        :class="{'today' : day.isToday, 'other-month' : !day.isCurrentMonth, 'current' : day.isCurrentDay, 'past' : day.isPast, 'future' : day.isFuture}"
                        @click.stop="updateDay(day, $event)"
                    )
                        span(
                            class="day-number"
                            aria-hidden="true"
                            v-text="day.monthDay"
                        )
                            | {{ day.monthDay }}
</template>

<script type="text/babel">
import moment from 'moment'
import Month from '../mixins/month'

export default {
    name: 'v-calendar-mini-month',

    props: {
        'day-format': {
            type: String,
            validator (val) {
                return ['full', 'short', 'min'].includes(val)
            },
            default: 'min'
        }
    },

    mixins: [
        Month
    ]
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
.month{
    width: 100%;
    &-view{
        display: table;
        table-layout: fixed;
    }
    &-header,
    &-body{
        display: table;
        table-layout: fixed;
        position: relative;
        width: 100%;
    }
}
.week-row{
    display: table-row;
}
.day-cell{
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    outline: none;
}
.day-number{
    display: block;
}
</style>
