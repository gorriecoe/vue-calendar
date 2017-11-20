import moment from 'moment'
import CalendarEvent from '../components/event'
import MonthNavigator from '../components/month-navigator'
import MonthNavigatorMixin from './month-navigator'

export default {
    props: {
        locale: {
            type: String,
            default: 'en'
        },
        format: {
            type: String,
            default: 'X'
        },
        firstDay: {
            type: [Number, String],
            validator(val) {
                let res = parseInt(val)
                return res >= 0 && res <= 6
            },
            default: 0
        },
        dayFormat: {
            type: String,
            validator(val) {
                return ['full', 'short', 'min'].includes(val)
            },
            default: 'short'
        },
        day: [String, Object],
        month: [String, Object]
    },

    mounted() {
        if (!this.day) {
            this.updateMonth(this.currentDay)
        } else {
            this.currentDay = moment(this.day).startOf('day')
        }
        if (!this.month) {
            this.updateMonth(this.currentMonth)
        } else {
            this.currentMonth = moment(this.month).startOf('month')
        }
        this.currentDates = this.getCalendar()
    },

    data() {
        return {
            currentDay: moment().startOf('day'),
            currentMonth: moment().startOf('month'),
            selectDay: {},
            currentDates: []
        }
    },

    watch: {
        day(date){
            this.currentDay = moment(date).startOf('day')
        },
        month(date){
            this.currentMonth = moment(date).startOf('month')
        },
        events: {
            handler: function (val, oldVal) {
                console.log(this.events);
                this.currentDates = this.getCalendar()
            },
            deep: true
        }
    },

    methods: {
        updateMonth(firstDayOfMonth) {
            this.currentMonth = firstDayOfMonth

            let emit = {
                month: firstDayOfMonth.format(this.format),
                viewStart: this.getMonthViewStartDate(firstDayOfMonth).format(this.format),
                viewEnd: this.getMonthViewEndDate(firstDayOfMonth).format(this.format)
            }

            this.$emit('update-month', emit)
        },

        updateDay(day, DOMevent) {
            this.currentDay = moment(day.date).startOf('day')
            let emit = {
                day: day.date.format(this.format),
                month: moment(day.date).startOf('month').format(this.format),
                viewStart: this.getMonthViewStartDate(day).format(this.format),
                viewEnd: this.getMonthViewEndDate(day).format(this.format)
            }

            this.$emit('update-day', emit, DOMevent)
        },

        getCalendar() {
            // calculate 2d-array of each month
            let monthViewStartDate = this.getMonthViewStartDate(this.currentMonth)
            let calendar = []

            for (let perWeek = 0; perWeek < 6; perWeek++) {
                let week = []

                for (let perDay = 0; perDay < 7; perDay++) {
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
                        timestamp: moment(monthViewStartDate).format('X')
                    })
                    monthViewStartDate.add(1, 'day')
                }

                calendar.push(week)
            }

            return calendar
        },

        getMonthViewStartDate(date) {
            let firstDay = parseInt(this.firstDay)
            let start = moment(date)
            let startOfMonth = moment(start.startOf('month'))

            start.subtract(startOfMonth.day(), 'days')

            if (startOfMonth.day() < firstDay) {
                start.subtract(7, 'days')
            }

            start.add(firstDay, 'days')

            return start
        },

        getMonthViewEndDate(date) {
            return this.getMonthViewStartDate().add(6, 'weeks')
        },

        localeWeekDay(weekday) {
            let firstDay = parseInt(this.firstDay)
            const localeMoment = moment().locale(this.locale)
            const localeData = localeMoment.localeData()
            switch (this.dayFormat) {
                case 'full':
                    var weekdays = localeData.weekdays()
                    break;
                case 'short':
                    var weekdays = localeData.weekdaysShort()
                    break;
                case 'min':
                    var weekdays = localeData.weekdaysMin()
                    break;
            }
            return weekdays[(weekday + firstDay) % 7]
        }
    },

    mixins: [
        MonthNavigatorMixin
    ],

    components: {
        'v-navigator': MonthNavigator
    }
}
