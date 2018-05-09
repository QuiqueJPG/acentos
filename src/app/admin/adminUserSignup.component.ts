import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-admin-user-signup-component',
	templateUrl: './adminUserSignup.component.html',
	styleUrls: ['./adminUserSignup.component.css']
})

export class AdminUserSignupComponent implements OnInit {

	signupForm: FormGroup;

	loading:boolean = false;

	constructor(private authService: AuthService,
				private router: Router,
				public snackBar: MatSnackBar){}

	ngOnInit(){
		this.signupForm = new FormGroup({
			firstName: new FormControl(null, Validators.required),
			lastName: new FormControl(null, Validators.required),
			userName: new FormControl(null, [
				Validators.required//,
				//Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),
			password: new FormControl(null, Validators.required)
		});

	}

	onSubmit() {
		if(this.signupForm.valid){
			this.loading = true;
			const {firstName, lastName, userName, password} = this.signupForm.value;
			const user = new User(userName, password, firstName, lastName);
			this.authService.signup(user)
				.subscribe(
					( user ) => {
						console.log(user);
						this.snackBar.open(`Se ha creado el usuario ${user.userName} exitosamente`, 'x', { duration: 5000,
						verticalPosition: 'top' });
						
						this.router.navigate(['/admin']);
					},
					//err => console.log(err)
					this.authService.handleAdminError
				);
			this.signupForm.reset();
		}
	}
}