import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { AdminUser } from '../auth/adminUser.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
	selector: 'app-admin-signin-component',
	templateUrl: './adminSignin.component.html',
	styleUrls: ['./adminSignin.component.css']
})

export class AdminSigninComponent implements OnInit {

	signinForm: FormGroup;
	returnUrl: string;
	loading:boolean = false;

	constructor(
		private authService: AuthService,
		private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar){}

	ngOnInit() {
		this.signinForm = new FormGroup({
			email: new FormControl(null, [
				Validators.required,
				Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),//valor por default y array de validaciones
			password: new FormControl(null, Validators.required)
		})

		// get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
	}

	onSubmit(){
		if(this.signinForm.valid){
			this.loading = true;
			const { email, password} = this.signinForm.value;

			const user = new AdminUser (email, password);
			this.authService.adminSignin(user)
				.subscribe(
					() => {
	                    this.router.navigateByUrl(this.returnUrl);
	                },
					(error) => {
						//Error en el servidor
						this.snackBar.open(error,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);
						this.authService.adminLogout();
						this.loading = false;
					}
				);	
		} else {
			//Not valid
			this.snackBar.open(`¡Verifica los datos e intenta nuevamente!`,
								'x',
								{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
			);
		}


	}
}