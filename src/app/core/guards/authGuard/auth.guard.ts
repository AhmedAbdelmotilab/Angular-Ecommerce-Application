import { CanActivateFn , Router } from '@angular/router';
import { inject , PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard : CanActivateFn = ( route , state ) => {
    const router = inject ( Router );
    const ID = inject ( PLATFORM_ID );
    if ( isPlatformBrowser ( ID ) ) {
        if ( localStorage.getItem ( 'userToken' ) !== null ) {
            return true;
        } else {
            router.navigate ( [ '/login' ] );
            return false;
        }
    } else {
        return false;
    }
};
