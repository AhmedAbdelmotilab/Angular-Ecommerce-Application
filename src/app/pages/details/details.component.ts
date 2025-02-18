import { Component , inject , OnDestroy , OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

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
    subscribeProductDetails : Subscription = new Subscription ();
    subscribeAddProductToCard : Subscription = new Subscription ();
    private readonly productsService = inject ( ProductsService );
    private readonly activatedRoute = inject ( ActivatedRoute );
    private readonly cart = inject ( CartService );
    private readonly toastrService = inject ( ToastrService );

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
        this.subscribeAddProductToCard = this.cart.addProductToCart ( id ).subscribe ( {
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

    changeMainImage ( image : string ) : void {
        this.mainImage = image;
    }

    ngOnInit () {
        this.getProductDetails ();
    }

    ngOnDestroy () {
        this.subscribeProductDetails.unsubscribe ();
        console.log ( 'UnsubscribeProductDetailsDone' );
    }
}
