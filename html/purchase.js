    <form id="purchase" method="POST" class="cc">
      <div class="plan-name">___ plan</div>
      <input type="hidden" name="amount" value="">
      <input type="hidden" name="plan" value="">
      <input type="hidden" name="extras" value="">
      
      <div>full name</div>
      <div>
        <input type="text" size="30" autocomplete="off" name="name">
      </div>
      
      <div>card number</div>
      <div>
        <input type="text" size="30" autocomplete="off" name="number">
      </div>
      
      <div>cvc</div>
      <div>
        <input type="text" size="4" autocomplete="off" name="cvc">
      </div>
      
      <div>expiration (mm/yyyy)</div>
      <div>
        <input type="text" size="2" name="expiry-month"/>
        <span> / </span>
        <input type="text" size="4" name="expiry-year"/>
      </div>
      
      <div>
        <input type="submit" value="purchase" class="purchase button">
        <div class="busy">
            Processing your transaction.
            Please be patient and don't re-submit!
        </div>
      </div>
      <div>
        We use <a href="https://stripe.com/">stripe</a> for billing.
        We don't store your card number anywhere ourselves.
      </div>
      <div class="error"></div>
    </form>
