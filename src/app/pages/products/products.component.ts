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
import { CurrencyPipe } from '@angular/common';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component ( {
    selector : 'app-products' ,
    templateUrl : './products.component.html' ,
    imports : [
        FormsModule ,
        SearchPipe ,
        RouterLink ,
        CurrencyPipe
    ] ,
    styleUrls : [ './products.component.scss' ]
} )
export class ProductsComponent implements OnInit , OnDestroy {
    searchInput : string = '';
    products : IProduct[] = [];
    subscribeAllProducts : Subscription = new Subscription ();
    subscribeAddProductToCard : Subscription = new Subscription ();
    subscribeAllCategories : Subscription = new Subscription ();
    subscribeAddProductToWishlist : Subscription = new Subscription ();
    categories : ICategory[] = [];
    filteredProducts : IProduct[] = [];
    selectedCategory : string = '';
    selectedPrice : number | null = null;
    protected readonly Math = Math;
    private readonly productsServices = inject ( ProductsService );
    private readonly cart = inject ( CartService );
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
        this.subscribeAddProductToCard = this.cart.addProductToCart ( id ).subscribe ( {
            next : ( res ) => {
                console.log ( res );
                if ( res.status === 'success' ) {
                    this.toastrService.success ( res.message , 'Creative Market' );
                }
            }
        } );
    }

    addProductToWishlist ( id : string ) : void {
        this.subscribeAddProductToWishlist = this.wishlistService.addProductToWishlist ( id ).subscribe ( {
            next : ( res ) => {
                console.log ( res );
                if ( res.status === 'success' ) {
                    this.toastrService.success ( res.message , 'Creative Market' );
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
    }

    ngOnDestroy () : void {
        this.subscribeAllProducts.unsubscribe ();
        console.log ( 'UnsubscribeAllProductsDone' );
        this.subscribeAddProductToCard.unsubscribe ();
        console.log ( 'UnsubscribeAddToCardDone' );
        this.subscribeAddProductToWishlist.unsubscribe ();
        console.log ( 'UnsubscribeAddProductToWishlistDone' );
    }
}
