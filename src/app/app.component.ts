import { Component , HostListener , OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component ( {
    selector : 'app-root' ,
    imports : [ RouterOutlet , NgxSpinnerComponent ] ,
    templateUrl : './app.component.html' ,
    styleUrl : './app.component.scss'
} )
export class AppComponent implements OnInit {
    showScrollButton = false;

    constructor ( private flowbiteService : FlowbiteService ) {}

    ngOnInit () : void {
        this.flowbiteService.loadFlowbite ( flowbite => {
        } );
    }

    @HostListener ( 'window:scroll' , [] )
    onWindowScroll () {
        this.showScrollButton = ( window.pageYOffset > 200 );
    }

    scrollToTop () {
        window.scrollTo ( {
            top : 0 ,
            behavior : 'smooth'
        } );
    }
}
