import { Component , inject , OnDestroy , OnInit } from '@angular/core';
import { FormBuilder , FormGroup , ReactiveFormsModule , Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component ( {
    selector : 'app-forgotpassword' ,
    imports : [ ReactiveFormsModule ] ,
    templateUrl : './forgotpassword.component.html' ,
    styleUrl : './forgotpassword.component.scss'
} )
export class ForgotpasswordComponent implements OnInit , OnDestroy {
    step : number = 1;
    isLoading : boolean = false;
    msgError : string = '';
    verifyEmail! : FormGroup;
    verifyCode! : FormGroup;
    resetPassword! : FormGroup;
    subscribeEmailVerify : Subscription = new Subscription ();
    subscribeCodeVerify : Subscription = new Subscription ();
    subscribeResetPassword : Subscription = new Subscription ();
    private readonly formBuilder = inject ( FormBuilder );
    private readonly authService = inject ( AuthService );
    private readonly router = inject ( Router );

    verifyEmailSubmit () : void {
        if ( this.verifyEmail.valid ) {
            this.isLoading = true;
            let emailValue = this.verifyEmail.get ( 'email' )?.value;
            this.resetPassword.get ( 'email' )?.patchValue ( emailValue );
            this.subscribeEmailVerify = this.authService.emailVerify ( this.verifyEmail.value ).subscribe ( {
                next : ( res ) => {
                    console.log ( res );
                    if ( res.statusMsg === 'success' ) {
                        this.step = 2;
                    }
                    this.isLoading = false;

                } ,
                error : ( err ) => {
                    console.log ( err );
                    this.isLoading = false;
                }
            } );
        }
    }

    verifyResetCode () : void {
        if ( this.verifyCode.valid ) {
            this.isLoading = true;
            this.subscribeCodeVerify = this.authService.codeVerify ( this.verifyCode.value ).subscribe ( {
                next : ( res ) => {
                    console.log ( res );
                    if ( res.status === 'Success' ) {
                        this.step = 3;
                    }
                    this.isLoading = false;
                } ,
                error : ( err ) => {
                    console.log ( err );
                    this.isLoading = false;
                    this.msgError = err.error.message;
                }
            } );
        }
    }

    resetPasswordSubmit () : void {
        if ( this.resetPassword.valid ) {
            this.isLoading = true;
            this.subscribeResetPassword = this.authService.restPassword ( this.resetPassword.value ).subscribe ( {
                next : ( res ) => {
                    console.log ( res );
                    localStorage.setItem ( 'userToken' , res.token );
                    this.authService.getUserData ();
                    this.router.navigate ( [ '/home' ] );
                    this.isLoading = false;
                } ,
                error : ( err ) => {
                    console.log ( err );
                    this.isLoading = false;
                }
            } );
        }
    }

    ngOnInit () {
        this.verifyEmail = this.formBuilder.group ( {
            email : [ null , [
                Validators.required ,
                Validators.email
            ] ]
        } );
        this.verifyCode = this.formBuilder.group ( {
            resetCode : [ null , [
                Validators.required ,
                Validators.pattern ( /^[0-9]{6}$/ )
            ] ]
        } );
        this.resetPassword = this.formBuilder.group ( {
            email : [ null , [
                Validators.required ,
                Validators.email
            ] ] ,
            newPassword : [ null , [
                Validators.required ,
                Validators.pattern ( /^[A-Z]\w{7,}$/ )
            ] ]
        } );
    }

    ngOnDestroy () {
        this.subscribeEmailVerify.unsubscribe ();
        console.log ( 'UnsubscribeEmailVerifyDone' );
        this.subscribeCodeVerify.unsubscribe ();
        console.log ( 'UnsubscribeCodeVerifyDone' );
        this.subscribeResetPassword.unsubscribe ();
        console.log ( 'UnsubscribeResetPasswordDone' );

    }
}
