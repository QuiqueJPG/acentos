import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AdminSigninGuard implements CanActivate {
	
	constructor(
	    private router: Router, 
	    private authService: AuthService) {}

	  canActivate() {
	    if (this.authService.isAdminLoggedIn()) {
	      
	      	this.router.navigate(['/admin']);
	      	return false;
	    }
	   
	    return true;
	}
}