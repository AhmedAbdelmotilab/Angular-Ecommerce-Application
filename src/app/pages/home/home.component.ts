import { Component , inject , OnDestroy , OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { CarouselModule , OwlOptions } from 'ngx-owl-carousel-o';
import { CurrencyPipe , TitleCasePipe } from '@angular/common';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component ( {
    selector : 'app-home' ,
    imports : [ CarouselModule , CurrencyPipe , SearchPipe , FormsModule , RouterLink , TitleCasePipe ] ,
    templateUrl : './home.component.html' ,
    styleUrl : './home.component.scss'
} )
export class HomeComponent implements OnInit , OnDestroy {
    searchInput : string = '';
    products : IProduct[] = [];
    categories : ICategory[] = [];
    userWishlist : IProduct[] = [];
    userWishlistIds : string[] = [];
    subscribeAllCategories : Subscription = new Subscription ();
    subscribeAllProducts : Subscription = new Subscription ();
    subscribeAddProductToCard : Subscription = new Subscription ();
    subscribeAddProductToWishlist : Subscription = new Subscription ();
    subscribeGetLoggedUserWishlist : Subscription = new Subscription ();
    images : string[] = [
        '../images/img1.avif' ,
        '../images/img2.avif' ,
        '../images/img3.avif' ,
        '../images/img4.avif' ,
        '../images/img5.avif' ,
        '../images/img6.avif'
    ];
    customOptionsCategories : OwlOptions = {
        loop : true ,
        mouseDrag : true ,
        touchDrag : true ,
        pullDrag : false ,
        dots : false ,
        navSpeed : 700 ,
        autoplay : true ,
        autoplayTimeout : 4000 ,
        autoplayHoverPause : true ,
        navText : [
            '<i class="fa-solid fa-caret-left text-blue-400 dark:text-purple-800  p-2 rounded-full"></i>' ,
            '<i class="fa-solid fa-caret-right text-blue-400 dark:text-purple-800  p-2 rounded-full"></i>'
        ] ,
        responsive : {
            0 : { items : 1 } ,
            400 : { items : 2 } ,
            740 : { items : 3 } ,
            940 : { items : 4 }
        } ,
        nav : true
    };
    customOptionsMain : OwlOptions = {
        loop : true ,
        mouseDrag : true ,
        touchDrag : true ,
        pullDrag : false ,
        dots : false ,
        navSpeed : 700 ,
        autoplay : true ,
        autoplayTimeout : 6000 ,
        autoplayHoverPause : true ,
        navText : [ '' , '' ] ,
        items : 1 ,

        nav : false
    };
    protected readonly Math = Math;
    private readonly productsServices = inject ( ProductsService );
    private readonly categoriesServices = inject ( CategoriesService );
    private readonly wishlistService = inject ( WishlistService );
    private readonly cartService = inject ( CartService );
    private readonly toastrService = inject ( ToastrService );

    getAllCategories () : void {
        this.subscribeAllCategories = this.categoriesServices.getAllCategories ().subscribe ( {
            next : ( res ) => {
                this.categories = res.data;
                console.log ( this.categories );

            }
        } );
    }

    getAllProducts () : void {
        this.subscribeAllProducts = this.productsServices.getAllProducts ().subscribe ( {
            next : ( res ) => {
                this.products = res.data;
                console.log ( this.products );
            }
        } );
    }

    addProductToCart ( id : string ) : void {
        this.subscribeAddProductToCard = this.cartService.addProductToCart ( id ).subscribe ( {
            next : ( res ) => {
                console.log ( res );
                if ( res.status === 'success' ) {
                    this.toastrService.success ( res.message , 'Creative Market' );
                    this.cartService.numberOfCartItems.next ( res.numOfCartItems );
                    console.log ( this.cartService.numberOfCartItems.getValue () );
                }
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
                console.log ( 'Wishlist IDs' , this.userWishlistIds );
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

    ngOnInit () {
        this.getAllProducts ();
        this.getAllCategories ();
        this.getLoggedUserWishlist ();

    }

    ngOnDestroy () {
        this.subscribeAllCategories.unsubscribe ();
        console.log ( 'UnsubscribeAllCategoriesDone' );
        this.subscribeAllProducts.unsubscribe ();
        console.log ( 'UnsubscribeAllProductsDone' );
        this.subscribeAddProductToCard.unsubscribe ();
        console.log ( 'UnsubscribeAddToCardDone' );
        this.subscribeGetLoggedUserWishlist.unsubscribe ();
        console.log ( 'UnsubscribeGetLoggedUserWishlistDone' );
        this.subscribeAddProductToWishlist.unsubscribe ();
        console.log ( 'UnsubscribeAddProductToWishlistDone' );
    }
}
