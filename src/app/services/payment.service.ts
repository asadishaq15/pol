import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BE_URL } from '../constants/app.constant';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${BE_URL}/payments`;
  constructor(private http: HttpClient) {}
  getSubscriptionPlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subscription-plans`);
  }

  getCurrentSubscription(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-subscription`);
  }

  createOrder(amount: number): Observable<{ orderId: string }> {
    return this.http.post<{ orderId: string }>(`${this.apiUrl}/create-order`, {
      amount,
    });
  }

  capturePayment(orderId: string, planId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/capture-payment`, {
      orderId,
      planId,
    });
  }

  cancelSubscription(subscriptionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cancel-subscription`, {
      subscriptionId,
    });
  }
}
