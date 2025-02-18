import { Component , inject , OnDestroy , OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { CarouselModule , OwlOptions } from 'ngx-owl-carousel-o';
import { CurrencyPipe } from '@angular/common';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component ( {
    selector : 'app-home' ,
    imports : [ CarouselModule , CurrencyPipe , SearchPipe , FormsModule , RouterLink ] ,
    templateUrl : './home.component.html' ,
    styleUrl : './home.component.scss'
} )
export class HomeComponent implements OnInit , OnDestroy {
    products : IProduct[] = [];
    categories : ICategory[] = [];
    subscribeAllCategories : Subscription = new Subscription ();
    subscribeAllProducts : Subscription = new Subscription ();
    subscribeAddProductToCard : Subscription = new Subscription ();
    searchInput : string = '';
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
    private readonly cart = inject ( CartService );
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
        this.subscribeAddProductToCard = this.cart.addProductToCart ( id ).subscribe ( {
            next : ( res ) => {
                console.log ( res );
                if ( res.status === 'success' ) {
                    this.toastrService.success ( res.message , 'Creative Market' );
                }
            }
        } );
    }

    ngOnInit () {
        this.getAllProducts ();
        this.getAllCategories ();
    }

    ngOnDestroy () {
        this.subscribeAllCategories.unsubscribe ();
        console.log ( 'UnsubscribeAllCategoriesDone' );
        this.subscribeAllProducts.unsubscribe ();
        console.log ( 'UnsubscribeAllProductsDone' );
        this.subscribeAddProductToCard.unsubscribe ();
        console.log ( 'UnsubscribeAddToCardDone' );
    }
}
