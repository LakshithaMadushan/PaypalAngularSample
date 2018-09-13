import {Component, AfterViewChecked} from '@angular/core';

declare let paypal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {

  addScript: boolean = false;
  paypalLoad: boolean = true;

  finalAmount: number = 1;

  paypalConfig = {
    env: 'sandbox',         // Optional: specify 'sandbox' environment
    client: {
      sandbox: 'Abz0BzOlbnWE5GW63IJ4U8GpIMIer6gtOpy0MkKhw1RWILixjVlw-XJYqMFRvDIxxuiMk8MZ1qtnO_G9',
      production: ''
    },
    locale: 'en_US',
    style: {                //Customize the PayPal Checkout Button :  https://developer.paypal.com/docs/checkout/
      size: 'small',
      color: 'gold',
      shape: 'pill',
      label: 'checkout',
      tagline: 'true'
    },
    commit: true,           // Optional: show a 'Pay Now' button in the checkout flow
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            {amount: {total: this.finalAmount, currency: 'USD'}}
          ],
          redirect_urls: {
            return_url: 'https://example.com',
            cancel_url: 'https://example_cancel.com'
          }
        }
      });
    },
    onAuthorize: (data, actions) => {

      return actions.payment.get()
        .then((paymentDetails) => {
          // Show a confirmation using the details from paymentDetails
          // Then listen for a click on your confirm button

          console.log('Payment Details :  ');

          document.querySelector('#confirm-button')
            .addEventListener('click', function () {
              // Execute the payment
              return actions.payment.execute().then((payment) => {
                //when payment is successful.
                console.log('Payment Complete! :  ' + payment);
              }).then(function () {
                // Show a success page to the buyer
              });
            });
        });

    },
    onCancel: (data, actions) => {
      // Show a cancel page or return to cart
    },
    onError: (err) => {
      // Show an error page here, when an error occurs
      console.log('Error happened!' + err);
    }
  };

  ngAfterViewChecked(): void {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
        this.paypalLoad = false;
      })
    }
  }

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    })
  }

}
