import { Component , inject , Inject , input , OnDestroy , OnInit , PLATFORM_ID } from '@angular/core';
import { RouterLink , RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { OrdersService } from '../../core/services/orders/orders.service';
import { jwtDecode } from 'jwt-decode';
import { IUser } from '../../shared/interfaces/iuser';

@Component ( {
    selector : 'app-navbar' ,
    imports : [ RouterLink , RouterLinkActive ] ,
    templateUrl : './navbar.component.html' ,
    styleUrl : './navbar.component.scss'
} )
export class NavbarComponent implements OnInit , OnDestroy {
    userData : IUser | null = {} as IUser;
    userId : string = '';
    isDarkMode = false;
    isMenuOpen = false;
    productsCartBadge : number = 0;
    productsWishlistBadge : number = 0;
    userOrdersBadge : number = 0;
    subscribeProductsCartBadge : Subscription = new Subscription ();
    subscribeProductsWishlistBadge : Subscription = new Subscription ();
    subscribeUserOrdersBadge : Subscription = new Subscription ();
    isLogin = input<boolean> ( true );
    readonly authService = inject ( AuthService );
    private readonly cartService = inject ( CartService );
    private readonly wishlistService = inject ( WishlistService );
    private readonly ordersService = inject ( OrdersService );

    constructor ( @Inject ( PLATFORM_ID ) private ID : any ) {}

    toggleMenu () {
        this.isMenuOpen = ! this.isMenuOpen;
    }

    checkOnTheDarkMode () : void {
        if ( isPlatformBrowser ( this.ID ) ) {
            this.isDarkMode = localStorage.getItem ( 'darkMode' ) === 'enabled';
            if ( this.isDarkMode ) {
                document.documentElement.classList.add ( 'dark' );
            }
        }
    }

    toggleDarkMode () {
        this.isDarkMode = ! this.isDarkMode;
        if ( this.isDarkMode ) {
            document.documentElement.classList.add ( 'dark' );
            localStorage.setItem ( 'darkMode' , 'enabled' );
        } else {
            document.documentElement.classList.remove ( 'dark' );
            localStorage.setItem ( 'darkMode' , 'disabled' );
        }
    }

    getUserId () : void {
        this.userData = jwtDecode ( localStorage.getItem ( 'userToken' )! );
        console.log ( this.userData );
        this.userId = this.userData?.id!;
        console.log ( this.userId );
    }

    cartBadge () : void {
        this.subscribeProductsCartBadge = this.cartService.numberOfCartItems.subscribe ( {
            next : ( value ) => {
                this.productsCartBadge = value;
            }
        } );
    }

    wishlistBadge () : void {
        this.subscribeProductsWishlistBadge = this.wishlistService.numberOfWishlistItems.subscribe ( {
            next : ( value ) => {
                this.productsWishlistBadge = value;
            }
        } );
    }

    ordersBadge () : void {
        this.subscribeUserOrdersBadge = this.ordersService.numberOfUserOrders.subscribe ( {
            next : ( value ) => {
                this.userOrdersBadge = value;
            }
        } );
    }

    ngOnInit () {
        this.checkOnTheDarkMode ();
        this.cartBadge ();
        this.wishlistBadge ();
        this.ordersBadge ();
        this.getUserId ();
        this.cartService.getLoggedUserCart ().subscribe ( {
            next : ( res ) => {
                this.cartService.numberOfCartItems.next ( res.numOfCartItems );
            }
        } );
        this.wishlistService.getLoggedUserWishlist ().subscribe ( {
            next : ( res ) => {
                this.wishlistService.numberOfWishlistItems.next ( res.data.length );
            }
        } );
        this.ordersService.getUserOrders ( this.userId ).subscribe ( {
            next : ( res ) => {
                this.ordersService.numberOfUserOrders.next ( res.length );
            }
        } );
    }

    ngOnDestroy () {
        this.subscribeProductsCartBadge.unsubscribe ();
        console.log ( 'UnsubscribeProductsCartBadgeDone' );
        this.subscribeProductsWishlistBadge.unsubscribe ();
        console.log ( 'UnsubscribeProductsWishlistBadgeDone' );
        this.subscribeUserOrdersBadge.unsubscribe ();
        console.log ( 'UnsubscribeUserOrdersBadgeDone' );
    }
}
