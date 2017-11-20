export default {
    props: {
        showYearNavigator: {
            type: Boolean,
            default: false
        },
        navigatorPrevYear: {
            type: String,
            default: '<<'
        },
        navigatorPrevMonth: {
            type: String,
            default: '<'
        },
        navigatorNextMonth: {
            type: String,
            default: '>'
        },
        navigatorNextYear: {
            type: String,
            default: '>>'
        }
    }
}
