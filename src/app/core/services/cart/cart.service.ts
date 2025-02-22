import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject , Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable ( {
    providedIn : 'root'
} )
export class CartService {
    numberOfCartItems : BehaviorSubject<number> = new BehaviorSubject ( 0 );

    constructor ( private httpClient : HttpClient ) { }

    addProductToCart ( id : string ) : Observable<any> {
        return this.httpClient.post ( `${ environment.baseUrl }/api/v1/cart` ,
            {
                'productId' : id
            }
        );
    };

    getLoggedUserCart () : Observable<any> {
        return this.httpClient.get ( `${ environment.baseUrl }/api/v1/cart`
        );
    }

    removeSpecificCartItem ( id : string ) : Observable<any> {
        return this.httpClient.delete ( `${ environment.baseUrl }/api/v1/cart/${ id }`
        );
    }

    updateCartProductQuantity ( id : string , count : number ) : Observable<any> {
        return this.httpClient.put ( `${ environment.baseUrl }/api/v1/cart/${ id }` ,
            {
                'count' : count
            }
        );
    }

    clearUserCart () : Observable<any> {
        return this.httpClient.delete ( `${ environment.baseUrl }/api/v1/cart`
        );
    }
}
