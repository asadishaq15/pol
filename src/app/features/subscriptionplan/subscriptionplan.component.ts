import { Component, OnInit, NgZone } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscriptionplan.component.html',
  styleUrls: ['./subscriptionplans.component.scss'],
})
export class SubscriptionPlansComponent implements OnInit {
  plans = [
    {
      id: 'basic',
      name: 'Advanced Auto-Obituary Plan',
      price: 3,
      membership: 'One Year Membership $36',
      auto: 'Automatic Renewal.',
      description:
        'Includes auto-obituary section plus more detailed life information such as achievements, diplomas, friends, employment, etc.',
      featuresList: [
        '1 picture to be used as funeral program cover photo',
        'Grandchildren Names & age • Siblings (Dates & Degrees)',
        'Employment (Titles & Dates) ',
        'Work Achievements ',
        'Education Achievements',
        'Special Achievements',
        'Club Memberships, Groups, etc',
        'When & where you met your spouse',
        'Other',
      ],
    },
    {
      id: 'standard',
      name: 'Legacy Creation Plan',
      price: 7,
      membership: 'One Year Membership $84',
      auto: 'Automatic Renewal.',
      description:
        'Leave the comfort of the sound of your voice. Make a video of you talking/singing etc. (Look in the section for talking topics.) Auto-obituary plan plus video memories, pictures, audio notes and short stories. Highlight your achievements over the years.',
      featuresList: [
        'Record up to ten 3-minute videos a year',
        'Upload up to 30 pictures w/ audio recorded descriptions.',
        // 'Priority support',
        // 'Advanced features',
      ],
    },
    {
      id: 'premium',
      name: '	Ultimate Legacy Creation Plan',
      price: 11,
      membership: 'One Year Membership $132',
      auto: 'Automatic Renewal.',
      description:
        'Includes legacy creation plan plus additional videos, pictures and audio notes.',
      featuresList: [
        'Records an additional three minute video',
        'Show as seen at the end',
        'Includes additional 60 pictures & 20 audio notes.',
        // 'All advanced features',
        // 'Custom branding options',
      ],
    },
    // {
    //   id: 'advance premium',
    //   name: 'Funeral Home Plan',
    //   price: 350,
    //   description:
    //     'Exclusively for organizations specializing in burial & home going services. Includes access to videos, pictures and obituary information of POML member accounts (When knowledge are inaccessible by purposes of providing a scanned funeral program created by and according to the wishes of the deceased.',
    //   featuresList: [
    //     '• Gain access to POML member account of the funeral program information in order to provide a service according to the direct wishes',
    //     '• Includes Video Link, if chosen in POML account holders account',

    //     // 'All advanced features',
    //     // 'Custom branding options',
    //   ],
    // },
  ];
  private paypalScriptLoaded = false;

  constructor(private paymentService: PaymentService, private ngZone: NgZone) {}

  ngOnInit() {
    this.loadPayPalScript().then(() => {
      this.initializePayPalButtons();
    });
  }

  private loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.paypalScriptLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${'ARNps61AVXJjxC1ArcGk1cA0kMyocB7SoilcRsnP2bfJB2EWXenlcUIe4PxNiTdWd5s6W0mq8SL2HC61'}&currency=USD`;

      script.onload = () => {
        this.paypalScriptLoaded = true;
        resolve();
      };

      script.onerror = (error) => {
        console.error('PayPal SDK could not be loaded:', error);
        reject(error);
      };

      document.body.appendChild(script);
    });
  }

  private initializePayPalButtons() {
    this.plans.forEach((plan) => {
      // @ts-ignore
      window.paypal
        .Buttons({
          createOrder: () => {
            return this.paymentService
              .createOrder(plan.price)
              .toPromise()
              .then((response) => response?.orderId ?? '');
          },
          onApprove: (data: any) => {
            return this.ngZone.run(() => {
              return this.paymentService
                .capturePayment(data.orderID, plan.id)
                .toPromise()
                .then((details) => {
                  alert('Transaction completed successfully!');
                  // Handle successful subscription
                })
                .catch((error) => {
                  console.error('Payment capture failed:', error);
                  alert('Transaction failed. Please try again.');
                });
            });
          },
          onError: (err: any) => {
            console.error('PayPal button error:', err);
            alert('An error occurred. Please try again later.');
          },
        })
        .render(`#paypal-button-${plan.id}`);
    });
  }
}
