var EventEmitter = require('events').EventEmitter;
var hyperglue = require('hyperglue');
var swoop = require('swoop');
var singlePage = require('single-page');
var path = require('path');

var html = {
    plan: require('./html/plan'),
    more: require('./html/more'),
    purchase: require('./html/purchase'),
    success: require('./html/success')
};

module.exports = Plans;

function Plans (opts, cb) {
    var self = this;
    if (!(this instanceof Plans)) return new Plans(opts, cb);
    EventEmitter.call(this);
    
    if (typeof opts === 'function') { cb = opts; opts = {} }
    if (!opts) opts = {};
    self.path = opts.path === undefined ? '/pricing' : opts.path;
    
    self.plans = {};
    
    self.pages = swoop({
        plans: document.createElement('div'),
    });
    
    self.pages.element.className = 'plans';
    self.pages.show('plans');
    
    var showPage = singlePage(function (href) {
        self._pageHandler(href);
    });
    self.showPage = function (href) {
        showPage(path.resolve(self.path, href));
    };
    
    if (typeof cb === 'function') self.on('buy', cb);
}

Plans.prototype = new EventEmitter;

Plans.prototype.add = function (name, plan) {
    var self = this;
    self.plans[name] = plan;
    
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
        ev.preventDefault();
        self.showPage(name);
    });
    self.pages.slides.plans.appendChild(label);
    
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
    var back = slide.querySelector('.back a');
    back.addEventListener('click', function (ev) {
        ev.preventDefault();
        window.history.back();
    });
    
    var buy = slide.querySelector('.buy');
    buy.addEventListener('click', function (ev) {
        self.showPage(name + '/purchase');
    });
    
    self.pages.addSlide(name, slide);
    
    var purchase = hyperglue(html.purchase, {
        '.plan-name': params['.title'],
        'input[name="amount"]': { value: plan.price },
        'input[name="plan"]': { value: name }
    });
    self.pages.addSlide(name + '/purchase', purchase);
    
    var back = purchase.querySelector('.back a');
    back.addEventListener('click', function (ev) {
        ev.preventDefault();
        window.history.back();
    });
};

Plans.prototype.appendTo = function (target) {
    if (typeof target === 'string') {
        target = document.querySelector(target);
    }
    this.pages.appendTo(target);
};

Plans.prototype._pageHandler = function (href) {
    var name = path.relative(this.path, href);
    if (href === '/' || name === '' || name === 'plans') {
        this.pages.show('plans');
    }
    else if (this.plans[name]) {
        this.pages.show(name);
    }
    else if (!/^(\.\.|\/)/.test(name)) {
        this.pages.show(name);
    }
};
