#vue-calendar

## Installation

@todo

## Usage

@todo

## Documentation

### Props

**events** : Events will be displayed on the calendar

```javascript
[
    {
        title:  'event 1',
        start: '2016-07-01',
        end: '2016-07-03',
        your data ...
    },
    {
        title: 'event 2',
        start: '2016-07-02',
        end: '2016-07-03',
        color: '#f00', // applied to background color
        your data ...
    },
    {
        title: 'event 3',
        start: '2016-07-02',
        end: '2016-07-03',
        color: {
            text: '#fff',
            background: '#000'
        },
        your data ...
    }
]         
```

- 'title': is the title of this event, will be displayed on calendar
- 'start': is the start day of this event
- 'end': is the end day of this event
- 'color': the color of the background and text
- You can define any additional data you may need

**locale** : the language displayed dates. Refer to [moment.js](http://momentjs.com/docs/#/i18n/) for locale.

- 'default' : 'en'

**firstDay** : first day of the week, 'Number', default: 0 (Sunday)
Sunday=0, Monday=1, Tuesday=2, etc.
Any number smaller than 0 or larger than 6 will be set to 0.

- 'default' : 0

**editable** :
**month** :
**day** :
**show-year-navigator** : Boolean
**navigatorPrevYear** : String
**navigatorNextYear** : String
**navigatorPrevMonth** : String
**navigatorNextMonth** : String

### Events

**update-event** :
```javascript
{
    title: 'event 3',
    start: Object, // moment object refer to http://momentjs.com/docs/#/get-set/
    end: Object, // moment object refer to http://momentjs.com/docs/#/get-set/
    color: {
        text: '#fff',
        background: '#000'
    },
    your data ...
}
```
**new-event** :
```javascript
{
    title: 'event 3',
    start: Object, // moment object refer to http://momentjs.com/docs/#/get-set/
    end: Object, // moment object refer to http://momentjs.com/docs/#/get-set/
    color: {
        text: '#fff',
        background: '#000'
    },
    your data ...
}
```
**update-month** :
**update-day** :
