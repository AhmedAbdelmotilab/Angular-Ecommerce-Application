import { AfterViewInit , Component , ElementRef , inject , OnDestroy , OnInit , ViewChild } from '@angular/core';
import { FormBuilder , FormGroup , FormsModule , ReactiveFormsModule , Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router , RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import lottie from 'lottie-web';
import { Subscription } from 'rxjs';

@Component ( {
    selector : 'app-login' ,
    imports : [
        FormsModule ,
        ReactiveFormsModule ,
        RouterLink
    ] ,
    templateUrl : './login.component.html' ,
    styleUrl : './login.component.scss'
} )
export class LoginComponent implements OnInit , AfterViewInit , OnDestroy {
    isLoading : boolean = false;
    isSuccess : string = '';
    msgError : string = '';
    toggleInput : boolean = false;
    subscribeAuthLogin : Subscription = new Subscription ();
    loginForm! : FormGroup;
    @ViewChild ( 'animationContainer' , { static : false } ) container! : ElementRef;
    private readonly formBuilder = inject ( FormBuilder );
    private readonly authService = inject ( AuthService );
    private readonly router = inject ( Router );
    private animation : any;

    submitForm () : void {
        if ( this.loginForm.valid ) {
            this.isLoading = true;
            this.subscribeAuthLogin = this.authService.SendLoginForm ( this.loginForm.value ).subscribe ( {
                next : ( res ) => {
                    if ( res.message === 'success' ) {
                        setTimeout ( () => {
                            localStorage.setItem ( 'userToken' , res.token );
                            this.authService.getUserData ();
                            this.router.navigate ( [ '/home' ] );
                        } , 1000 );
                        this.isSuccess = res.message;
                    }
                    console.log ( res );
                    this.isLoading = false;
                } ,
                error : ( err : HttpErrorResponse ) => {
                    this.msgError = err.error.message;
                    this.isLoading = false;
                    setTimeout ( () => {this.msgError = '';} , 5000 );
                }
            } );
        } else {
            this.loginForm.markAllAsTouched ();
        }

    }

    togglePassword () : void {
        this.toggleInput = ! this.toggleInput;
    }

    ngOnInit () {
        this.loginForm = this.formBuilder.group ( {
            email : [ null , [
                Validators.required ,
                Validators.email
            ] ] ,
            password : [ null , [
                Validators.required ,
                Validators.pattern ( /^[A-Z]\w{7,}$/ )
            ] ]
        } );
    }

    ngAfterViewInit () : void {
        if ( this.container ) {
            this.animation = lottie.loadAnimation ( {
                container : this.container.nativeElement ,
                renderer : 'svg' ,
                loop : true ,
                autoplay : true ,
                path : './images/freshCart.json'
            } );
        }
    }

    ngOnDestroy () {
        this.subscribeAuthLogin.unsubscribe ();
        console.log ( 'UnsubscribeAuthLoginDone' );
    }
}
