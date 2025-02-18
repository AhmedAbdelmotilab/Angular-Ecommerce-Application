import { inject , Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { IUser } from '../../../shared/interfaces/iuser';

@Injectable ( {
    providedIn : 'root'
} )
export class AuthService {
    userData : IUser | null = {} as IUser;
    private readonly router = inject ( Router );

    constructor ( private httpClient : HttpClient ) { }

    SendRegisterForm ( data : object ) : Observable<any> {
        return this.httpClient.post ( `${ environment.baseUrl }/api/v1/auth/signup` , data );
    }

    SendLoginForm ( data : object ) : Observable<any> {
        return this.httpClient.post ( `${ environment.baseUrl }/api/v1/auth/signin` , data );
    }

    getUserData () : void {
        this.userData = jwtDecode ( localStorage.getItem ( 'userToken' )! );
        console.log ( this.userData );
    }

    logoutUser () : void {
        localStorage.removeItem ( 'userToken' );
        this.userData = null;
        this.router.navigate ( [ '/login' ] );
    }

    emailVerify ( data : object ) : Observable<any> {
        return this.httpClient.post ( `${ environment.baseUrl }/api/v1/auth/forgotPasswords` , data );
    }

    codeVerify ( data : object ) : Observable<any> {
        return this.httpClient.post ( `${ environment.baseUrl }/api/v1/auth/verifyResetCode` , data );
    }

    restPassword ( data : object ) : Observable<any> {
        return this.httpClient.put ( `${ environment.baseUrl }/api/v1/auth/resetPassword` , data );
    }

}
