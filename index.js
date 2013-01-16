var EventEmitter = require('events').EventEmitter;
var hyperglue = require('hyperglue');
var swoop = require('swoop');
var singlePage = require('single-page');
var slideways = require('slideways');
var path = require('path');

var Payment = require('./lib/payment');

var html = {
    plan: require('./static/html/plan'),
    plans: require('./static/html/plans'),
    more: require('./static/html/more'),
    purchase: require('./static/html/purchase'),
    success: require('./static/html/success'),
    error: require('./static/html/error')
};
var css = require('./static/css');

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
    
    self.pages.element.className = 'pricing-widget';
    
    self.pages.show('plans');
    
    process.nextTick(function () {
        var style = window.getComputedStyle(self.pages.element);
        self.pages.element.style.height = style.height;
    });
    
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
    
    if (typeof cb === 'function') self.on('payment', cb);
    
    if (opts.insertCss !== false) self._insertCss();
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
    
    var errorPage = hyperglue(html.error, { '.plan-name': params['.title'] });
    (function () {
        var back = errorPage.querySelector('.back a')
        back.addEventListener('click', function (ev) {
            ev.preventDefault();
            self.showPage(name + '/purchase');
        });
    })();
    self.pages.addSlide(name + '/purchase/error', errorPage);
    
    self.pages.addSlide(name + '/purchase/success', hyperglue(html.success, {
        '.plan-name': params['.title']
    }));
    
    var busy = false;
    
    self.pages.on('show', function (href) {
        if (href === name + '/purchase') {
            purchase.querySelector('.pre-busy').style.display = 'block';
            purchase.querySelector('.busy').style.display = 'none';
            busy = false;
        }
    });
    
    purchase.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (busy) return;
        busy = true;
        
        purchase.querySelector('.pre-busy').style.display = 'none';
        purchase.querySelector('.busy').style.display = 'block';
        
        var cvc = purchase.querySelector('input[name="cvc"]');
        var number = purchase.querySelector('input[name="number"]');
        
        var payment = new Payment({
            name: name,
            number: number.value,
            amount: plan.price.formula
                ? plan.price.formula(quantity.value)
                : plan.price
            ,
            cvc: cvc.value,
            exp_month: purchase.querySelector('input[name="exp-month"]').value,
            exp_year: purchase.querySelector('input[name="exp-year"]').value,
        });
        number.value = '';
        cvc.value = '';
        
        payment.on('accept', function () {
            self.showPage(name + '/purchase/success');
        });
        
        payment.on('reject', function (err) {
            errorPage.querySelector('.message').textContent = err;
            self.showPage(name + '/purchase/error');
        });
        
        self.emit('payment', payment);
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

Plans.prototype._insertCss = function () {
    if (this._insertedCss) return;
    this._insertedCss = true;
    
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    if (document.head.childNodes.length) {
        document.head.insertBefore(style, document.head.childNodes[0]);
    }
    else {
        document.head.appendChild(style);
    }
};
