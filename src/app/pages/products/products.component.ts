import { Component , inject , OnDestroy , OnInit } from '@angular/core';
import { IProduct } from '../../shared/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../core/services/products/products.service';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { RouterLink } from '@angular/router';
import { CurrencyPipe , TitleCasePipe } from '@angular/common';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component ( {
    selector : 'app-products' ,
    templateUrl : './products.component.html' ,
    imports : [
        FormsModule ,
        SearchPipe ,
        RouterLink ,
        CurrencyPipe ,
        TitleCasePipe
    ] ,
    styleUrls : [ './products.component.scss' ]
} )
export class ProductsComponent implements OnInit , OnDestroy {
    searchInput : string = '';
    selectedCategory : string = '';
    selectedPrice : number | null = null;
    products : IProduct[] = [];
    categories : ICategory[] = [];
    filteredProducts : IProduct[] = [];
    userWishlist : IProduct[] = [];
    userWishlistIds : string[] = [];
    subscribeAllProducts : Subscription = new Subscription ();
    subscribeAddProductToCard : Subscription = new Subscription ();
    subscribeAllCategories : Subscription = new Subscription ();
    subscribeGetLoggedUserWishlist : Subscription = new Subscription ();
    subscribeAddProductToWishlist : Subscription = new Subscription ();
    protected readonly Math = Math;
    private readonly productsServices = inject ( ProductsService );
    private readonly cartService = inject ( CartService );
    private readonly toastrService = inject ( ToastrService );
    private readonly categoriesServices = inject ( CategoriesService );
    private readonly wishlistService = inject ( WishlistService );

    filterProducts () : void {
        console.log ( 'Selected Category:' , this.selectedCategory );
        console.log ( 'Selected Price:' , this.selectedPrice );
        this.filteredProducts = this.products.filter ( product => {
            const matchesCategory = this.selectedCategory
                ? product.category?.name.toLowerCase () === this.selectedCategory.toLowerCase ()
                : true;
            const matchesPrice = this.selectedPrice ? product.price <= this.selectedPrice : true;
            console.log (
                'Product:' ,
                product.title ,
                'Matches Category:' ,
                matchesCategory ,
                'Matches Price:' ,
                matchesPrice
            );
            return matchesCategory && matchesPrice;
        } );
        console.log ( 'Filtered Products:' , this.filteredProducts );
    }

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
                this.filteredProducts = this.products;
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

    resetFilters () : void {
        this.selectedCategory = '';
        this.selectedPrice = null;
        this.filteredProducts = [ ...this.products ];
    }

    ngOnInit () : void {
        this.getAllProducts ();
        this.getAllCategories ();
        this.getLoggedUserWishlist ();
    }

    ngOnDestroy () : void {
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
