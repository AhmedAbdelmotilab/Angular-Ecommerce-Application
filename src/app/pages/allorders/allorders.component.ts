import { Component , inject , OnDestroy , OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { IUser } from '../../shared/interfaces/iuser';
import { OrdersService } from '../../core/services/orders/orders.service';
import { Subscription } from 'rxjs';
import { IOrder } from '../../shared/interfaces/iorder';
import { CurrencyPipe } from '@angular/common';

@Component ( {
    selector : 'app-allorders' ,
    imports : [ CurrencyPipe ] ,
    templateUrl : './allorders.component.html' ,
    styleUrl : './allorders.component.scss'
} )
export class AllordersComponent implements OnInit , OnDestroy {
    userData : IUser | null = {} as IUser;
    userId : string = '';
    orders : IOrder[] = [];
    subscribeGetUserOrders : Subscription = new Subscription ();

    private readonly ordersService = inject ( OrdersService );

    getUserId () : void {
        this.userData = jwtDecode ( localStorage.getItem ( 'userToken' )! );
        console.log ( this.userData );
        this.userId = this.userData?.id !;
        console.log ( this.userId );
    }

    getUserOrders ( id : string ) : void {
        this.subscribeGetUserOrders = this.ordersService.getUserOrders ( id ).subscribe ( {
            next : ( res ) => {
                console.log ( res );
                this.orders = res;
            }
        } );
    }

    ngOnInit () {
        this.getUserId ();
        this.getUserOrders ( this.userId );
    }

    ngOnDestroy () {
        this.subscribeGetUserOrders.unsubscribe ();
        console.log ( 'UnsubscribeGetUserOrdersDone' );
    }
}
