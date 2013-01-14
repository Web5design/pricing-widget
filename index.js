var EventEmitter = require('events').EventEmitter;
var hyperglue = require('hyperglue');
var swoop = require('swoop');
var singlePage = require('single-page');
var slideways = require('slideways');
var path = require('path');

var html = {
    plan: require('./html/plan'),
    plans: require('./html/plans'),
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
        plans: hyperglue(html.plans, {})
    });
    
    self.pages.element.className = 'plans';
    self.pages.show('plans');
    
    var first = true;
    var showPage = singlePage(function (href) {
        var parts = href.split('/');
        if (first && parts[parts.length-1] === 'purchase') {
            var plan = self.plans[parts[parts.length-2]];
            if (plan && plan.price.formula) return showPage(name);
        }
        first = false;
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
        '.price .amount': plan.price.formula
            ? plan.price.formula(plan.price.init)
            : plan.price
        ,
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
    
    label.querySelector('.starting').style.display
        = plan.price.formula ? 'inline' : 'none'
    ;
    
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
        })(),
        '.quantity input[name="quantity"]': {
            value: plan.price && plan.price.initial || 2
        },
        '.quantity .formula': plan.price.equation || '0',
        '.quantity .result': plan.price.formula
            && plan.price.formula(plan.price.initial)
    });
    
    var result = slide.querySelector('.result');
    var quantity = slide.querySelector('input[name="quantity"]');
    
    slide.querySelector('.quantity').style.display
        = plan.price.formula ? 'block' : 'none'
    ;
    
    if (plan.price.formula) {
        var slider = slideways({
            min: plan.price.min,
            max: plan.price.max,
            init: plan.price.init,
            snap: 1
        });
        slider.appendTo(slide.querySelector('.slide'));
        slider.on('value', function (value) {
            quantity.value = value;
            var amount = plan.price.formula(value);
            result.textContent = amount;
            slide.querySelector('.amount').textContent = amount;
            buy.style.display = value <= 0 ? 'none' : 'block';
        });
        quantity.addEventListener('change', onchange);
        quantity.addEventListener('keydown', onchange);
        function onchange () { slider.set(quantity.value) }
    }
    
    (function () {
        var back = slide.querySelector('.back a');
        back.addEventListener('click', function (ev) {
            ev.preventDefault();
            self.showPage('plans');
        });
    })();
    
    var buy = slide.querySelector('.buy');
    buy.addEventListener('click', function (ev) {
        var amount = plan.price.formula
            ? plan.price.formula(quantity.value)
            : plan.price
        ;
        purchase.querySelector('.amount').textContent = amount;
        self.showPage(name + '/purchase');
    });
    if (plan.price <= 0) buy.style.display = 'none';
    
    self.pages.addSlide(name, slide);
    
    var purchase = hyperglue(html.purchase, {
        '.plan-name': params['.title'],
        '.amount': plan.price.formula
            ? plan.price.formula(plan.price.init)
            : plan.price
        ,
        'input[name="amount"]': { value: plan.price },
        'input[name="plan"]': { value: name },
    });
    self.pages.addSlide(name + '/purchase', purchase);
    
    var busy = false;
    
    self.pages.on('show', function (href) {
        if (href === name + '/purchase') {
            purchase.querySelector('.purchase').style.display = 'block';
            purchase.querySelector('.busy').style.display = 'none';
            busy = false;
        }
    });
    
    purchase.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (busy) return;
        busy = true;
        
        purchase.querySelector('.purchase').style.display = 'none';
        purchase.querySelector('.busy').style.display = 'block';
        
        self.emit('purchase', {
            name: name,
            number: plan.price.formula ? quantity.value : 1,
            amount: plan.price.formula
                ? plan.price.formula(quantity.value)
                : plan.price
            ,
            cvc: purchase.querySelector('input[name="cvc"]').value,
            exp_month: purchase.querySelector('input[name="exp-month"]').value,
            exp_year: purchase.querySelector('input[name="exp-year"]').value
        });
    });
    
    (function () {
        var back = purchase.querySelector('.back a');
        back.addEventListener('click', function (ev) {
            ev.preventDefault();
            self.showPage(name);
        });
    })();
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
