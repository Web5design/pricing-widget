module.exports = [  
  '<form id="purchase" method="POST" class="cc">',
    '<div>',
      '<span class="plan-name"></span>',
      '($<span class="amount"></span> USD)',
    '</div>',
    
    '<div>full name</div>',
    '<div>',
    '<input type="text" size="30" autocomplete="off" name="name">',
    '</div>',
    
    '<div>card number</div>',
    '<div>',
    '<input type="text" size="30" autocomplete="off" name="number">',
    '</div>',
    
    '<div>cvc</div>',
    '<div>',
    '<input type="text" size="4" autocomplete="off" name="cvc">',
    '</div>',
    
    '<div>expiration (mm/yyyy)</div>',
    '<div>',
    '<input type="text" size="2" name="exp-month"/>',
    '<span> / </span>',
    '<input type="text" size="4" name="exp-year"/>',
    '</div>',
    
    '<div class="purchase">',
      '<input type="submit" value="purchase" class="button">',
      '<div>',
        'We use <a href="https://stripe.com/">stripe</a> for billing.',
        'We don\'t store your card number anywhere ourselves.',
      '</div>',
    '</div>',
    '<div class="busy">',
      '<div class="busy-image"></div>',
      'Processing your transaction.',
      'Please be patient and don\'t re-submit!',
    '</div>',
    '</div>',
    '<div class="back">',
      '<a href="#">back</a>',
    '</div>',
  '</form>'
].join('\n')