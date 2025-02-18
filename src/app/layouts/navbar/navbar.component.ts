import { Component , inject , Inject , input , OnInit , PLATFORM_ID } from '@angular/core';
import { RouterLink , RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';

@Component ( {
    selector : 'app-navbar' ,
    imports : [ RouterLink , RouterLinkActive ] ,
    templateUrl : './navbar.component.html' ,
    styleUrl : './navbar.component.scss'
} )
export class NavbarComponent implements OnInit {
    readonly authService = inject ( AuthService );
    isLogin = input<boolean> ( true );
    isDarkMode = false;

    /* For Dark Mode */
    constructor ( @Inject ( PLATFORM_ID ) private ID : any ) {
    }

    ngOnInit () {
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
}
