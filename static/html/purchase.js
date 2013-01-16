module.exports = [  
  '<form method="POST" class="cc">',
    '<div>',
      '<span class="plan-name"></span>',
      '(<span class="symbol">$</span><span class="amount"></span>',
      ' <span class="currency">USD</span>)',
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
    
    '<div class="pre-busy">',
      '<input type="submit" value="purchase" class="purchase button">',
      '<div class="purchase-note note"></div>',
    '</div>',
    '<div class="busy">',
      '<div class="busy-image">processing...</div>',
      '<div class="busy-note note"></div>',
    '</div>',
    '</div>',
    '<div class="back">',
      '<a href="#">back</a>',
    '</div>',
  '</form>'
].join('\n')
