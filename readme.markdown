# pricing-widget

Accept online payments by credit card.

This module provides only the browser interface code necessary for accepting
online payments.

We use this widget code at [browserling](http://browserling.com/) which you
should definitely check out if you need to do some cross-browser testing!

# example

The default style [looks like this](http://substack.net/projects/pricing-widget/basic/),
but
[you can get fancy](http://substack.net/projects/pricing-widget/browserling/).

``` js
var pricing = require('pricing-widget');
var plans = pricing(function (payment) {
    console.log('purchased ' + payment.name);
    payment.accept();
});
plans.appendTo(document.body);

plans.add('free', {
    price: 0,
    per: 'month',
    image: 'images/free.png',
    description: 'Great for students, casual cross-browser testing,'
        + ' and product evaluation',
    features: [ '5-minute sessions' ],
    more: [
        'Use browserling for 5 minutes at a time as much as you like.',
        'Sometimes you\'ll need to wait in a queue if the site is busy.'
    ]
});

plans.add('developer', {
    price: 20,
    per: 'month',
    image: 'images/developer.png',
    description: 'Perfect for designers, front-end developers, and freelancers'
        + ' who need to check their work against all the browsers.',
    features: [ 'unlimited sessions', 'ssh tunnels' ],
    more: [
        'Use browserling for as long as you need, as much as you like.',
        'SSH tunnels to access localhost and intranet services'
    ]
});

plans.add('team', {
    price: {
        equation: '20 + 10 * (n - 1)',
        formula: function (n) { return 20 + 10 * (n - 1) },
        min: 2,
        max: 10,
        init: 2
    },
    per: 'month',
    image: 'images/team.png',
    description: 'Perfect for whole teams of designers and developers!',
    features: [ 'unlimited sessions', 'ssh tunnels' ],
    more: [
        'Use browserling for as long as you need, as much as you like.',
        'SSH tunnels to access localhost and intranet services',
        'Share a plan among your whole team!'
    ]
});
```
# methods

## var plans = pricing(opts={}, cb)

Create a new pricing widget.

You can optionally set the `opts.path` root to use for push-state routing.

`cb` is an optional shortcut to listen on `'payment'` events.

## plans.appendTo(target)

Append the `plans.element` dom node to the dom element or query selector string
`target`.

## plans.add(name, plan)

Add a `plan` object with a string `name`.

`plan` should have a:

* `plan.description` - text to briefly describe the plan
* `plan.image` - the image to show for the plan
* `plan.price` - the amount to pay

`plan.price` can get fancy, as in the example above that uses a `formula`
function starting at `init` and constrained between `min` and `max` with
`equation` as a formula description.


`plan` can optionally have:

* `plan.per` - payment interval, if applicable
* `plan.features` - short list to show below the plan name
* `plan.more` - long-form string to describe the plan when clicked on

## plans.note(page, msg)

There are several places in the UI where you can add some notes to the html;

`'currency'`, `'purchase'`, `'busy'`, and `'success'` are all valid `page`
locations.

## plans.setCurrency(name)

Set a currency `name` different from the default name `'USD'`.

## plans.setSymbol(symbol)

Set a currency `symbol` different from the default symbol `'$'`.

## payment.accept()

Accept a `'payment'` object from a payment event, showing the user the success
page.

## payment.reject(err)

Reject a `'payment'` object from a payment event, showing the error page with
the `err` message.

# events

## plans.on('payment', function (payment) {})

When somebody clicks the purchase button, this `payment` event fires.

At this point you should make the api calls out to your payment processor and
then call either `payment.accept()` or `payment.reject(errMessage)` to show the
user what the result of the transaction is.

The parameters to payment are designed to fit well with the
[stripe create_charge](https://stripe.com/docs/api#create_charge) api endpoint.
The keys in `payment` are:

* name
* number
* amount
* cvc
* exp_month
* exp_year

# attributes

## plans.element

This is the raw dom node that pricing-widget appends all its html content to if
you don't want to use `.appendTo()`.

# install

With [npm](https://npmjs.org) do:

```
$ npm install pricing-widget
```

Then use [browserify](http://browserify.org) to `require('pricing-widget')`.

# license

MIT
