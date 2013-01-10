var EventEmitter = require('events').EventEmitter;
var hyperglue = require('hyperglue');

var html = {
    pricing: require('./html/pricing'),
    plan: require('./html/plan'),
    //purchase: require('./html/purchase'),
    success: require('./html/success')
};

module.exports = Plans;

function Plans (cb) {
    if (!(this instanceof Plans)) return new Plans(cb);
    EventEmitter.call(this);
    
    this.element = document.createElement('div');
    if (typeof cb === 'function') this.on('buy', cb);
}

Plans.prototype = new EventEmitter;

Plans.prototype.add = function (name, plan) {
    var div = hyperglue(html.plan, {
        '.icon img': { src: plan.image },
        '.price .amount': plan.price,
        '.price .per': plan.per ? '/ ' + plan.per : '',
        '.title': plan.title !== undefined ? plan.title : name + ' ' + plan,
        '.desc .text': plan.description || '',
    });
    this.element.appendChild(div);
};

Plans.prototype.appendTo = function (target) {
    if (typeof target === 'string') {
        target = document.querySelector(target);
    }
    target.appendChild(this.element);
};
