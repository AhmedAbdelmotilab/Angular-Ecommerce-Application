import { Component , inject , OnDestroy , OnInit } from '@angular/core';
import { FormBuilder , FormGroup , FormsModule , ReactiveFormsModule , Validators } from '@angular/forms';
import { ActivatedRoute , Router } from '@angular/router';
import { OrdersService } from '../../core/services/orders/orders.service';
import { Subscription } from 'rxjs';

@Component ( {
    selector : 'app-checkout' ,
    imports : [
        FormsModule ,
        ReactiveFormsModule ] ,
    templateUrl : './checkout.component.html' ,
    styleUrl : './checkout.component.scss'
} )
export class CheckoutComponent implements OnInit , OnDestroy {
    isLoading : boolean = false;
    checkOut! : FormGroup;
    cartId : string = '';
    subscribeCheckOut : Subscription = new Subscription ();
    private readonly formBuilder = inject ( FormBuilder );
    private readonly activatedRoute = inject ( ActivatedRoute );
    private readonly ordersService = inject ( OrdersService );
    private readonly router = inject ( Router );

    checkOutForm () : void {
        this.checkOut = this.formBuilder.group ( {
            details : [ null , [
                Validators.required
            ] ] ,
            phone : [ null , [
                Validators.required ,
                Validators.pattern ( /^01[0125][0-9]{8}$/ )
            ] ] ,
            city : [ null , [
                Validators.required
            ] ]
        } );
    }

    getUserCardId () : void {
        this.activatedRoute.paramMap.subscribe ( {
            next : ( param ) => {
                this.cartId = param.get ( 'id' )!;
                console.log ( this.cartId );
            }
        } );
    }

    checkout ( paymentMethod : string ) : void {
        console.log ( this.checkOut.value );
        console.log ( this.activatedRoute.paramMap );

        if ( paymentMethod === 'online' ) {
            this.subscribeCheckOut = this.ordersService.checkOutOnlinePayment ( this.cartId , this.checkOut.value ).subscribe ( {
                next : ( res ) => {
                    console.log ( 'Online Payment Response:' , res );
                    if ( res.status === 'success' ) {
                        open ( res.session.url , '_self' );
                    }
                } ,
                error : ( err ) => {
                    console.log ( 'Online Payment Error:' , err );
                }
            } );
        } else if ( paymentMethod === 'cash' ) {
            this.subscribeCheckOut = this.ordersService.checkOutCashPayment ( this.cartId , this.checkOut.value ).subscribe ( {
                next : ( res ) => {
                    console.log ( 'Cash on Delivery Response:' , res );
                    this.router.navigate ( [ '/allorders' ] );
                } ,
                error : ( err ) => {
                    console.log ( 'Cash on Delivery Error:' , err );
                }
            } );
        }
    }


    ngOnInit () {
        this.checkOutForm ();
        this.getUserCardId ();
    }

    ngOnDestroy () {
        this.subscribeCheckOut.unsubscribe ();
        console.log ( 'UnsubscribeCheckOutDone' );
    }
}
