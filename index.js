var EventEmitter = require('events').EventEmitter;
var hyperglue = require('hyperglue');
var swoop = require('swoop');

var html = {
    plan: require('./html/plan'),
    more: require('./html/more'),
    //purchase: require('./html/purchase'),
    success: require('./html/success')
};

module.exports = Plans;

function Plans (cb) {
    if (!(this instanceof Plans)) return new Plans(cb);
    EventEmitter.call(this);
    
    this.plans = document.createElement('div');
    
    this.pages = swoop({
        plans: this.plans
    });
    this.pages.element.className = 'plans';
    this.pages.show('plans');
    
    if (typeof cb === 'function') this.on('buy', cb);
}

Plans.prototype = new EventEmitter;

Plans.prototype.add = function (name, plan) {
    var self = this;
    
    var params = {
        '.icon img': { src: plan.image },
        '.price .amount': plan.price,
        '.price .per': plan.per ? '/ ' + plan.per : '',
        '.title': plan.title !== undefined ? plan.title : name + ' plan',
        '.desc .text': plan.description || '',
        '.features': (plan.features || []).join(', ')
    };
    var label = hyperglue(html.plan, params);
    label.addEventListener('click', function (ev) {
        label.style.display = 'block';
        self.pages.show('_' + name);
    });
    self.plans.appendChild(label);
    
    var slide = hyperglue(html.more, {
        '.heading': hyperglue(html.plan, params),
        '.list': (function () {
            var ul = document.createElement('ul');
            var morePoints = plan.more || [];
            for (var i = 0; i < morePoints.length; i++) {
                var li = document.createElement('li');
                li.appendChild(document.createTextNode(morePoints[i]));
                ul.appendChild(li);
            }
            return ul;
        })()
    });
    self.pages.addSlide('_' + name, slide);
};

Plans.prototype.appendTo = function (target) {
    if (typeof target === 'string') {
        target = document.querySelector(target);
    }
    this.pages.appendTo(target);
};
