import { AfterViewInit , Component , ElementRef , inject , OnDestroy , OnInit , ViewChild } from '@angular/core';
import { Router , RouterLink } from '@angular/router';
import { AbstractControl , FormBuilder , FormGroup , ReactiveFormsModule , Validators } from '@angular/forms';
import lottie from 'lottie-web';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component ( {
    selector : 'app-register' ,
    imports : [ ReactiveFormsModule , RouterLink ] ,
    templateUrl : './register.component.html' ,
    styleUrl : './register.component.scss'
} )
export class RegisterComponent implements OnInit , AfterViewInit , OnDestroy {
    isLoading : boolean = false;
    isSuccess : string = '';
    msgError : string = '';
    toggleInput : boolean = false;
    subscribeAuthRegister : Subscription = new Subscription ();
    registerForm! : FormGroup;
    @ViewChild ( 'animationContainer' , { static : false } ) container! : ElementRef;
    private readonly formBuilder = inject ( FormBuilder );
    private readonly authService = inject ( AuthService );
    private readonly router = inject ( Router );
    private animation : any;

    confirmPassword ( group : AbstractControl ) {
        const password = group.get ( 'password' )?.value;
        const rePassword = group.get ( 'rePassword' )?.value;
        return password === rePassword ? null : { mismatch : true };
    }

    submitForm () : void {
        if ( this.registerForm.valid ) {
            this.isLoading = true;
            this.subscribeAuthRegister = this.authService.SendRegisterForm ( this.registerForm.value ).subscribe ( {
                next : ( res ) => {
                    if ( res.message === 'success' ) {
                        setTimeout ( () => {this.router.navigate ( [ '/login' ] ); } , 1000 );
                        this.isSuccess = res.message;
                    }
                    this.isLoading = false;
                } ,
                error : ( err : HttpErrorResponse ) => {
                    this.msgError = err.error.message;
                    this.isLoading = false;
                    setTimeout ( () => {this.msgError = '';} , 5000 );
                }
            } );
        } else {
            this.registerForm.markAllAsTouched ();
        }

    }

    togglePassword () : void {
        this.toggleInput = ! this.toggleInput;
    }

    ngOnInit () {
        this.registerForm = this.formBuilder.group ( {
            name : [ null , [
                Validators.required ,
                Validators.minLength ( 3 ) ,
                Validators.maxLength ( 20 )
            ] ] ,
            email : [ null , [
                Validators.required ,
                Validators.email
            ] ] ,
            password : [ null , [
                Validators.required ,
                Validators.pattern ( /^[A-Z]\w{7,}$/ )
            ] ] ,
            rePassword : [ null , [
                Validators.required
            ] ] ,
            phone : [ null , [
                Validators.required ,
                Validators.pattern ( /^01[0125][0-9]{8}$/ )
            ] ]
        } , { validators : this.confirmPassword } );
    }

    ngAfterViewInit () : void {
        if ( this.container ) {
            this.animation = lottie.loadAnimation ( {
                container : this.container.nativeElement ,
                renderer : 'svg' ,
                loop : true ,
                autoplay : true ,
                path : './images/signup.json'
            } );
        }
    }

    ngOnDestroy () {
        this.subscribeAuthRegister.unsubscribe ();
        console.log ( 'UnsubscribeAuthRegisterDone' );
    }
}
