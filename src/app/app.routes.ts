import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { loggedGuard } from './core/guards/loggedGuard/logged.guard';
import { authGuard } from './core/guards/authGuard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AuthLayoutComponent,
        canActivate: [loggedGuard],
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./pages/login/login.component').then(
                        (c) => c.LoginComponent
                    ),
                title: 'Login',
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./pages/register/register.component').then(
                        (c) => c.RegisterComponent
                    ),
                title: 'Register',
            },
            {
                path: 'forgotpassword',
                loadComponent: () =>
                    import(
                        './pages/forgotpassword/forgotpassword.component'
                    ).then((c) => c.ForgotpasswordComponent),
                title: 'Reset Password',
            },
        ],
    },
    {
        path: '',
        component: BlankLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'home',
                loadComponent: () =>
                    import('./pages/home/home.component').then(
                        (c) => c.HomeComponent
                    ),
                title: 'Home',
            },
            {
                path: 'products',
                loadComponent: () =>
                    import('./pages/products/products.component').then(
                        (c) => c.ProductsComponent
                    ),
                title: 'Products',
            },
            {
                path: 'cart',
                loadComponent: () =>
                    import('./pages/cart/cart.component').then(
                        (c) => c.CartComponent
                    ),
                title: 'Cart',
            },
            {
                path: 'brands',
                loadComponent: () =>
                    import('./pages/brands/brands.component').then(
                        (c) => c.BrandsComponent
                    ),
                title: 'Brands',
            },
            {
                path: 'categories',
                loadComponent: () =>
                    import('./pages/categories/categories.component').then(
                        (c) => c.CategoriesComponent
                    ),
                title: 'Categories',
            },
            {
                path: 'checkout/:id',
                loadComponent: () =>
                    import('./pages/checkout/checkout.component').then(
                        (c) => c.CheckoutComponent
                    ),
                data: { prerender: false },
                title: 'Checkout',
            },
            {
                path: 'details/:id',
                loadComponent: () =>
                    import('./pages/details/details.component').then(
                        (c) => c.DetailsComponent
                    ),
                data: { prerender: false },
                title: 'Details',
            },
            {
                path: 'allorders',
                loadComponent: () =>
                    import('./pages/allorders/allorders.component').then(
                        (c) => c.AllordersComponent
                    ),
                title: 'Order',
            },
            {
                path: '**',
                loadComponent: () =>
                    import('./pages/notfound/notfound.component').then(
                        (c) => c.NotfoundComponent
                    ),
                title: 'NotFound',
            },
        ],
    },
];
