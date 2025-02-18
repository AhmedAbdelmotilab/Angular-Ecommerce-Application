import { HttpInterceptorFn } from '@angular/common/http';
import { catchError , throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const errorsInterceptor : HttpInterceptorFn = ( req , next ) => {
    return next ( req ).pipe ( catchError ( ( err ) => {
        if ( err.error.statusMsg === 'fail' ) {
            Swal.fire ( {
                title : 'Oops!' ,
                text : err.error.message ,
                icon : 'error' ,
                confirmButtonColor : '#ff4d4f' ,
                background : '#1a1a1a' ,
                color : '#fff' ,
                timer : 3000 ,
                timerProgressBar : true ,
                showConfirmButton : true
            } );
        }
        return throwError ( () => err );
    } ) );
};
