import { Routes } from '@angular/router';
import { HomeComponent } from './search/home/home.component';
import  {LoginComponent} from './auth/login/login.component'

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Ruta principal
    { path: 'login', component: LoginComponent }, // Ruta Login
    { path: '**', redirectTo: '' }, // Redirección para rutas no encontradas
];
