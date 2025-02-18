import { Component , inject } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component ( {
    selector : 'app-categories' ,
    imports : [
        FormsModule
    ] ,
    templateUrl : './categories.component.html' ,
    styleUrl : './categories.component.scss'
} )
export class CategoriesComponent {
    searchInput : string = '';
    categories : ICategory[] = [];
    subscribeAllCategories : Subscription = new Subscription ();
    private readonly categoriesServices = inject ( CategoriesService );

    getAllCategories () : void {
        this.subscribeAllCategories = this.categoriesServices.getAllCategories ().subscribe ( {
            next : ( res ) => {
                this.categories = res.data;
                console.log ( this.categories );
            }
        } );
    }

    ngOnInit () {
        this.getAllCategories ();
    }

    ngOnDestroy () {
        this.subscribeAllCategories.unsubscribe ();
        console.log ( 'UnsubscribeAllCategoriesDone' );
    }
}
