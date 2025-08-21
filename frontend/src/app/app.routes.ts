import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { EventsListComponent } from './events/events-list/events-list.component';
import { EventBookingComponent } from './events/event-booking/event-booking.component';
import { EventDetailComponent } from './events/event-details/event-detail.component';
import { authGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';


export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'events', component: EventsListComponent },
	{ path: 'events/:id', component: EventDetailComponent },
	{ path: 'events/:id/book', component: EventBookingComponent, canActivate:[authGuard] },
	{ path: '**', redirectTo: '' }
];
