var pricing = require('../../');
var plans = pricing(function (payment) {
    console.log('purchased ' + payment.name);
    setTimeout(function () { payment.accept() }, 2000);
});
plans.appendTo('#pricing');

plans.add('free', {
    price: 0,
    per: 'month',
    image: 'images/free.png',
    description: 'Great for students, casual cross-browser testing,'
        + ' and product evaluation',
    features: [ '5-minute sessions' ],
    more: [
        'Use browserling for 5 minutes at a time as much as you like.',
        'Sometimes you\'ll need to wait in a queue if the site is busy.'
    ]
});

plans.add('developer', {
    price: 20,
    per: 'month',
    image: 'images/developer.png',
    description: 'Perfect for designers, front-end developers, and freelancers'
        + ' who need to check their work against all the browsers.',
    features: [ 'unlimited sessions', 'ssh tunnels' ],
    more: [
        'Use browserling for as long as you need, as much as you like.',
        'SSH tunnels to access localhost and intranet services'
    ]
});

plans.add('team', {
    price: {
        equation: '20 + 10 * (n - 1)',
        formula: function (n) { return 20 + 10 * (n - 1) },
        min: 2,
        max: 10,
        init: 2
    },
    per: 'month',
    image: 'images/developer.png',
    description: 'Perfect for whole teams of designers and developers!',
    features: [ 'unlimited sessions', 'ssh tunnels' ],
    more: [
        'Use browserling for as long as you need, as much as you like.',
        'SSH tunnels to access localhost and intranet services'
    ]
});
