import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject , Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable ( {
    providedIn : 'root'
} )
export class OrdersService {
    numberOfUserOrders : BehaviorSubject<number> = new BehaviorSubject ( 0 );

    constructor ( private httpClient : HttpClient ) { }

    checkOutOnlinePayment ( cartId : string , data : object ) : Observable<any> {
        return this.httpClient.post ( `${ environment.baseUrl }/api/v1/orders/checkout-session/${ cartId }?url=http://localhost:4200` ,
            {
                'shippingAddress' : data
            }
        );
    }

    checkOutCashPayment ( cartId : string , data : object ) : Observable<any> {
        return this.httpClient.post ( `${ environment.baseUrl }/api/v1/orders/${ cartId }` ,
            {
                'shippingAddress' : data
            }
        );
    }

    getUserOrders ( id : string ) : Observable<any> {
        return this.httpClient.get ( `${ environment.baseUrl }/api/v1/orders/user/${ id }` );
    }
}
