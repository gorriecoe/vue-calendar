<template lang="pug">
    div(class="calendar-navigator")
        span(
            v-if="showYearNavigator"
            class="navigator prev prev-year"
            @click.stop="goToMonth(-1, 'years')"
            slot="navigator-prev-year"
        )
            | {{ navigatorPrevYear }}
        span(
            class="navigator prev prev-month"
            @click.stop="goToMonth(-1, 'months')"
            slot="navigator-prev-year"
        )
            | {{ navigatorPrevMonth }}
        span(
            class="navigator next next-month"
            @click.stop="goToMonth(1, 'months')"
            slot="navigator-next-month"
        )
            | {{ navigatorNextMonth }}
        span(
            v-if="showYearNavigator"
            class="navigator next next-year"
            @click.stop="goToMonth(1, 'years')"
            slot="navigator-next-year"
        )
            | {{ navigatorNextYear }}
        span(class="title")
            | {{ title }}
</template>
<script type="text/babel">
import moment from 'moment'
import MonthNavigator from '../mixins/month-navigator'

export default {
    name: 'v-month-navigator',

    props: {
        currentMonth: Object,
        locale: {
            type: String,
            default: 'en'
        }
    },

    computed: {
        title() {
            if (!this.currentMonth) return;
            return this.currentMonth.locale(this.locale).format('MMMM YYYY')
        }
    },

    methods: {
        goToMonth(duration, period) {
            var page = moment(this.currentMonth).add(duration, period).startOf('month')
            this.$emit('change', page)
        }
    },

    mixins: [
        MonthNavigator
    ]
}
</script>

<style lang="scss">
.navigator {
    cursor: pointer;
    display: inline-block;
}
</style>
