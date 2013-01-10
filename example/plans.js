var pricing = require('../');
var plans = pricing(function (plan) {
    console.log('purchased ' + plan.name);
    plan.confirm();
});
plans.appendTo('#pricing');

plans.add('free', {
    price: 0,
    per: 'month',
    image: 'images/free.png',
    description: 'free plan...'
});

plans.add('developer', {
    price: 20,
    per: 'month',
    image: 'images/developer.png',
    description: 'developer plan...'
});
