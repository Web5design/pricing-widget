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
    
    this.element = hyperglue(html.box, {});
    this.plans = document.createElement('div');
    
    this.pages = swoop({
        plans: this.plans
    });
    this.pages.show('plans');
    this.pages.appendTo(this.element);
    
    if (typeof cb === 'function') this.on('buy', cb);
}

Plans.prototype = new EventEmitter;

Plans.prototype.add = function (name, plan) {
    var self = this;
    var more = document.createElement('ul');
    var morePoints = plan.more || [];
    for (var i = 0; i < morePoints.length; i++) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(morePoints[i]));
        more.appendChild(li);
    }
    
    var params = {
        '.icon img': { src: plan.image },
        '.price .amount': plan.price,
        '.price .per': plan.per ? '/ ' + plan.per : '',
        '.title': plan.title !== undefined ? plan.title : name + ' plan',
        '.desc .text': plan.description || '',
        '.features': (plan.features || []).join(', '),
        '.more': more,
    };
    var label = hyperglue(html.plan, params);
    more.style.display = 'none';
    
    label.addEventListener('click', function (ev) {
        label.style.display = 'block';
        self.pages.show('_' + name);
    });
    self.plans.appendChild(label);
    
    var slide = label.cloneNode(true);
    slide.querySelector('.more').style.display = 'block';
    self.pages.addSlide('_' + name, slide);
};

Plans.prototype.appendTo = function (target) {
    if (typeof target === 'string') {
        target = document.querySelector(target);
    }
    target.appendChild(this.element);
};
