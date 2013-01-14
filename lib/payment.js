var EventEmitter = require('events').EventEmitter;

module.exports = Payment;

function Payment (opts) {
    if (!(this instanceof Payment)) return new Payment(opts);
    EventEmitter.call(this);
    
    this.name = opts.name;
    this.number = opts.number;
    this.amount = opts.amount;
    this.cvc = opts.cvc;
    this.exp_month = opts.exp_month;
    this.exp_year = opts.exp_year;
}

Payment.prototype = new EventEmitter;

Payment.prototype.accept = function () {
    this.emit('accept');
};

Payment.prototype.reject = function (err) {
    this.emit('reject', err);
};
