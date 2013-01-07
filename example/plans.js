var pricing = require('../');
var plans = pricing(function (plan, cb) {
    console.log('purchased ' + plan.name);
    cb(null);
});
plans.appendTo('#plan');

plans.add('free', {
    price: 0,
    per: 'month',
    title: 'free plan',
    image: 'images/free.png',
    description: 'free plan...'
});

plans.add('developer', {
    price: 20,
    per: 'month',
    title: 'developer plan',
    image: 'images/free.png',
    description: 'developer plan...'
});
