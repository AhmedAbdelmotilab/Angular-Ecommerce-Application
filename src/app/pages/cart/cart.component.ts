import { Component , inject , OnDestroy , OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { Subscription } from 'rxjs';
import { ICart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component ( {
    selector : 'app-cart' ,
    imports : [ CurrencyPipe , RouterLink , SweetAlert2Module ] ,
    templateUrl : './cart.component.html' ,
    styleUrl : './cart.component.scss'
} )
export class CartComponent implements OnInit , OnDestroy {
    subscribeGetLoggedUserCart : Subscription = new Subscription ();
    subscribeRemoveSpecificCartItem : Subscription = new Subscription ();
    subscribeUpdateCartProductQuantity : Subscription = new Subscription ();
    subscribeClearUserCart : Subscription = new Subscription ();
    userCartData : ICart = {} as ICart;

    private readonly cartService = inject ( CartService );

    getLoggedUserCart () : void {
        this.subscribeGetLoggedUserCart = this.cartService.getLoggedUserCart ().subscribe ( {
            next : ( res ) => {
                console.log ( res );
                this.userCartData = res.data;
                console.log ( this.userCartData );
            }
        } );
    }

    removeSpecificCartItem ( id : string ) : void {
        Swal.fire ( {
            title : 'Are you sure?' ,
            text : 'Once deleted, this action cannot be undone.' ,
            icon : 'warning' ,
            showCancelButton : true ,
            confirmButtonText : 'Yes, delete it!' ,
            cancelButtonText : 'Cancel' ,
            confirmButtonColor : '#42b983' ,
            cancelButtonColor : '#ff4d4f' ,
            background : '#1a1a1a' ,
            color : '#fff' ,
            backdrop : 'rgba(0, 0, 0, 0.7)'

        } ).then ( ( result ) => {
            if ( result.isConfirmed ) {
                this.subscribeRemoveSpecificCartItem = this.cartService.removeSpecificCartItem ( id ).subscribe ( {
                    next : ( res ) => {
                        console.log ( res );
                        this.userCartData = res.data;
                        if ( res.status === 'success' ) {
                            Swal.fire ( {
                                title : 'Deleted!' ,
                                text : 'Your item has been removed.' ,
                                icon : 'success' ,
                                confirmButtonColor : '#42b983' ,
                                background : '#1a1a1a' ,
                                color : '#fff' ,
                                timer : 3000 ,
                                timerProgressBar : true ,
                                showConfirmButton : true
                            } );
                            this.cartService.numberOfCartItems.next ( res.numOfCartItems );
                        }
                    }
                } );
            }
        } );
    }

    updateCartProductQuantity ( id : string , count : number ) {
        this.subscribeUpdateCartProductQuantity = this.cartService.updateCartProductQuantity ( id , count ).subscribe ( {
            next : ( res ) => {
                console.log ( res );
                this.userCartData = res.data;
                if ( res.status === 'success' ) {
                    Swal.fire ( {
                        title : 'Updated!' ,
                        text : 'Your item has been Added.' ,
                        icon : 'success' ,
                        confirmButtonColor : '#42b983' ,
                        background : '#1a1a1a' ,
                        color : '#fff' ,
                        timer : 3000 ,
                        timerProgressBar : true ,
                        showConfirmButton : true
                    } );
                }
            }
        } );
    }

    clearUserCart () : void {
        Swal.fire ( {
            title : 'Are you sure?' ,
            text : 'You won\'t be able to undo this action!' ,
            icon : 'warning' ,
            showCancelButton : true ,
            confirmButtonText : 'Yes, clear my cart!' ,
            cancelButtonText : 'Cancel' ,
            confirmButtonColor : '#f39c12' ,
            cancelButtonColor : '#e74c3c' ,
            background : '#2c3e50' ,
            color : '#ecf0f1' ,
            backdrop : 'rgba(44, 62, 80, 0.8)'

        } ).then ( ( result ) => {
            if ( result.isConfirmed ) {
                this.subscribeClearUserCart = this.cartService.clearUserCart ().subscribe ( {
                    next : ( res ) => {
                        console.log ( res );
                        this.userCartData = {} as ICart;
                        if ( res.message === 'success' ) {
                            Swal.fire ( {
                                title : 'Cart Cleared!' ,
                                text : 'Your shopping cart has been cleared.' ,
                                icon : 'success' ,
                                confirmButtonColor : '#f39c12' ,
                                background : '#2c3e50' ,
                                color : '#ecf0f1' ,
                                timer : 3000 ,
                                timerProgressBar : true ,
                                showConfirmButton : true
                            } );
                            this.cartService.numberOfCartItems.next ( 0 );
                        }
                    }
                } );
            }
        } );
    }

    ngOnInit () {
        this.getLoggedUserCart ();
    }


    ngOnDestroy () {
        this.subscribeGetLoggedUserCart.unsubscribe ();
        console.log ( 'UnsubscribeGetLoggedUserCartDone' );
        this.subscribeRemoveSpecificCartItem.unsubscribe ();
        console.log ( 'UnsubscribeRemoveSpecificCartItemDone' );
        this.subscribeUpdateCartProductQuantity.unsubscribe ();
        console.log ( 'UnsubscribeUpdateCartProductQuantityDone' );
        this.subscribeClearUserCart.unsubscribe ();
        console.log ( 'UnsubscribeClearUserCartDone' );
    }

}
