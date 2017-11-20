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
            this.currentDay = {
                start: moment(this.day).startOf('day'),
                end: moment(this.day).endOf('day')
            }
        }
        if (!this.month) {
            this.updateMonth(this.currentMonth)
        } else {
            this.currentMonth = moment(this.month).startOf('month')
        }
    },

    data() {
        return {
            currentDay: {
                start: moment().startOf('day'),
                end: moment().endOf('day')
            },
            currentMonth: moment().startOf('month'),
            selectDay: {}
        }
    },

    watch: {
        day(date){
            this.currentDay = moment(date).startOf('day')
        },
        month(date){
            this.currentMonth = moment(date).startOf('month')
        }
    },

    computed: {
        currentDates() {
            return this.getCalendar()
        }
    },

    methods: {
        updateMonth(firstDayOfMonth) {
            this.currentMonth = firstDayOfMonth

            let emit = {
                month: firstDayOfMonth,
                viewStart: this.getMonthViewStartDate(firstDayOfMonth),
                viewEnd: this.getMonthViewEndDate(firstDayOfMonth)
            }

            this.$emit('update-month', emit)
        },

        updateDay(day, DOMevent) {
            var date = moment(day.date)
            if (DOMevent.shiftKey) {

            } else {
                this.currentDay = {
                    start: date.startOf('day'),
                    end: date.endOf('day')
                }
            }

            let emit = {
                day: day.date,
                viewStart: this.getMonthViewStartDate(day),
                viewEnd: this.getMonthViewEndDate(day)
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
