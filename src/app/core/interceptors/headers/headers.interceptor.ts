import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor : HttpInterceptorFn = ( req , next ) => {
    /* Logic Belong To REQ  --> Send Headers With The REQ */
    /* 1. Check On The Token If It Available */
    /* 2. Clone From The REQ */
    /* 3. Send The Configuration That I Want To Send It With The REQ */
    if ( localStorage.getItem ( 'userToken' ) ) {
        req = req.clone ( {
            setHeaders : {
                token : localStorage.getItem ( 'userToken' )!
            }
        } );
    }
    return next ( req ); /* Logic Belong To RES */
};
