import { Component , inject , OnDestroy , OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../shared/interfaces/ibrand';
import { DatePipe , TitleCasePipe , UpperCasePipe } from '@angular/common';

@Component ( {
    selector : 'app-brands' ,
    imports : [
        DatePipe ,
        UpperCasePipe ,
        TitleCasePipe
    ] ,
    templateUrl : './brands.component.html' ,
    styleUrl : './brands.component.scss'
} )
export class BrandsComponent implements OnInit , OnDestroy {
    brands : IBrand[] = [];
    subscribeGetAllBrands : Subscription = new Subscription ();
    private readonly brandsService = inject ( BrandsService );

    getAllBrands () : void {
        this.subscribeGetAllBrands = this.brandsService.getAllBrands ().subscribe ( {
            next : ( res ) => {
                console.log ( res );
                this.brands = res.data;
                console.log ( this.brands );
            }
        } );
    }

    ngOnInit () {
        this.getAllBrands ();
    }

    ngOnDestroy () {
        this.subscribeGetAllBrands.unsubscribe ();
        console.log ( 'UnsubscribeGetAllBrandsDone' );
    }
}
