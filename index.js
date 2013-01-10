var EventEmitter = require('events').EventEmitter;
var hyperglue = require('hyperglue');
var swoop = require('swoop');

var html = {
    box: require('./html/box'),
    plan: require('./html/plan'),
    //purchase: require('./html/purchase'),
    success: require('./html/success')
};

module.exports = Plans;

function Plans (cb) {
    if (!(this instanceof Plans)) return new Plans(cb);
    EventEmitter.call(this);
    
    this.pages = swoop({
        plans: hyperglue(html.box, {})
    });
    this.pages.show('plans');
    
    if (typeof cb === 'function') this.on('buy', cb);
}

Plans.prototype = new EventEmitter;

Plans.prototype.add = function (name, plan) {
    var div = hyperglue(html.plan, {
        '.icon img': { src: plan.image },
        '.price .amount': plan.price,
        '.price .per': plan.per ? '/ ' + plan.per : '',
        '.title': plan.title !== undefined ? plan.title : name + ' plan',
        '.desc .text': plan.description || '',
    });
    this.pages.slides.plans.appendChild(div);
};

Plans.prototype.appendTo = function (target) {
    if (typeof target === 'string') {
        target = document.querySelector(target);
    }
    this.pages.appendTo(target);
};
