import { Component , inject , OnDestroy , OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component ( {
    selector : 'app-details' ,
    imports : [
        CurrencyPipe
    ] ,
    templateUrl : './details.component.html' ,
    styleUrl : './details.component.scss'
} )
export class DetailsComponent implements OnInit , OnDestroy {
    productId : string = '';
    productDetails : IProduct = {} as IProduct;
    mainImage : string = '';
    userWishlist : IProduct[] = [];
    userWishlistIds : string[] = [];
    subscribeProductDetails : Subscription = new Subscription ();
    subscribeAddProductToCard : Subscription = new Subscription ();
    subscribeGetLoggedUserWishlist : Subscription = new Subscription ();
    subscribeAddProductToWishlist : Subscription = new Subscription ();
    private readonly productsService = inject ( ProductsService );
    private readonly activatedRoute = inject ( ActivatedRoute );
    private readonly cartService = inject ( CartService );
    private readonly toastrService = inject ( ToastrService );
    private readonly wishlistService = inject ( WishlistService );

    getProductDetails () : void {
        this.activatedRoute.paramMap.subscribe ( {
            next : ( res ) => {
                this.productId = res.get ( 'id' ) || '';
                this.subscribeProductDetails = this.productsService.getSpecificProduct ( this.productId ).subscribe ( {
                    next : ( res ) => {
                        this.productDetails = res.data;
                        this.mainImage = this.productDetails.imageCover;
                        console.log ( this.productDetails );
                    } ,
                    error : ( err ) => console.log ( err )
                } );
            } ,
            error : ( err ) => console.log ( err )
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

    getLoggedUserWishlist () : void {
        this.subscribeGetLoggedUserWishlist = this.wishlistService.getLoggedUserWishlist ().subscribe ( {
            next : ( res : { data : IProduct[] } ) => {
                this.userWishlist = [];
                this.userWishlistIds = [];
                res.data.forEach ( ( item : IProduct ) => {
                    this.userWishlist.push ( item );
                    this.userWishlistIds.push ( item.id );
                } );
                console.log ( 'Wishlist IDs:' , this.userWishlistIds );
            }
        } );
    }

    addProductToWishlist ( id : string ) : void {
        if ( this.userWishlistIds.includes ( id ) ) {
            this.toastrService.warning ( 'This product is already in your wishlist!' , 'Creative Market' );
            return;
        }
        this.subscribeAddProductToWishlist = this.wishlistService.addProductToWishlist ( id ).subscribe ( {
            next : ( res ) => {
                console.log ( res );
                if ( res.status === 'success' ) {
                    this.toastrService.success ( res.message , 'Creative Market' );
                    this.wishlistService.numberOfWishlistItems.next ( res.data.length );
                    this.userWishlist.push ( res.data );
                    this.userWishlistIds.push ( id );
                }
            }
        } );
    }

    changeMainImage ( image : string ) : void {
        this.mainImage = image;
    }

    ngOnInit () {
        this.getProductDetails ();
        this.getLoggedUserWishlist ();
    }

    ngOnDestroy () {
        this.subscribeProductDetails.unsubscribe ();
        console.log ( 'UnsubscribeProductDetailsDone' );
        this.subscribeGetLoggedUserWishlist.unsubscribe ();
        console.log ( 'UnsubscribeGetLoggedUserWishlistDone' );
        this.subscribeAddProductToWishlist.unsubscribe ();
        console.log ( 'UnsubscribeAddProductToWishlistDone' );
    }
}
