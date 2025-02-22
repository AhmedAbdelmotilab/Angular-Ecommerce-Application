import { Component , inject , OnDestroy , OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component ( {
    selector : 'app-wishlist' ,
    imports : [ CurrencyPipe , RouterLink ] ,
    templateUrl : './wishlist.component.html' ,
    styleUrl : './wishlist.component.scss'
} )
export class WishlistComponent implements OnInit , OnDestroy {
    userWishlist : IProduct[] = [];
    subscribeGetLoggedUserWishlist : Subscription = new Subscription ();
    subscribeDeleteProductFromWishlist : Subscription = new Subscription ();
    subscribeAddProductToCard : Subscription = new Subscription ();
    private readonly cartService = inject ( CartService );
    private readonly wishlistService = inject ( WishlistService );
    private readonly toastrService = inject ( ToastrService );

    getLoggedUserWishlist () : void {
        this.subscribeGetLoggedUserWishlist = this.wishlistService.getLoggedUserWishlist ().subscribe ( {
            next : ( res ) => {
                console.log ( res );
                this.userWishlist = res.data;
                console.log ( this.userWishlist );
            }
        } );
    }

    deleteProductFromWishlist ( id : string ) : void {

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
                this.subscribeDeleteProductFromWishlist = this.wishlistService.deleteProductFromWishlist ( id ).subscribe ( {
                    next : ( res ) => {
                        console.log ( res );
                        this.getLoggedUserWishlist ();
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
                        }
                        this.wishlistService.numberOfWishlistItems.next ( res.data.length );
                    }
                } );
            }
        } );
    }

    addProductToCart ( id : string ) : void {
        this.subscribeAddProductToCard = this.cartService.addProductToCart ( id ).subscribe ( {
            next : ( res ) => {
                console.log ( res );
                if ( res.status === 'success' ) {
                    this.toastrService.success ( res.message , 'Creative Market' );
                }
            } ,
            error : ( err ) => {
                console.log ( err );
            }
        } );
    }


    ngOnInit () {
        this.getLoggedUserWishlist ();
    }

    ngOnDestroy () {
        this.subscribeGetLoggedUserWishlist.unsubscribe ();
        console.log ( 'UnsubscribeGetLoggedUserWishlistDone' );
        this.subscribeDeleteProductFromWishlist.unsubscribe ();
        console.log ( 'UnsubscribeDeleteProductFromWishlistDone' );
    }
}
