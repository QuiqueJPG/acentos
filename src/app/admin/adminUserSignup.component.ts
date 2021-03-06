import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { noWhitespaceValidator } from '../utils/noWhitespaces.validator';

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
			firstName: new FormControl(null, [Validators.required, Validators.maxLength(50), noWhitespaceValidator, Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+$/)]),
			lastName: new FormControl(null, [Validators.required, Validators.maxLength(50), noWhitespaceValidator, Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+$/)]),
			userName: new FormControl(null, [Validators.required, Validators.maxLength(20), noWhitespaceValidator]),
			school: new FormControl(null, [Validators.required, Validators.maxLength(100), noWhitespaceValidator]),
			grade: new FormControl(null, [Validators.required]),
			password: new FormControl(null, [Validators.required, Validators.maxLength(10), noWhitespaceValidator])
		});

	}

	onSubmit() {
		if(this.signupForm.valid){
			this.loading = true;
			const {firstName, lastName, userName, password, school, grade} = this.signupForm.value;
			const user = new User(userName, password, firstName, lastName, school, grade);
			this.authService.signup(user)
				.subscribe(
					( user ) => {
						this.snackBar.open(`Se ha creado el usuario ${user.userName} exitosamente`,
											'x', 
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);
						
						this.router.navigate(['/admin']);
					},
					(error) => {
						//Error en el servidor
						if(error==="Registro de usuario falló. Nombre de usuario ya está en uso"){
							this.snackBar.open(error,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
							);
							this.loading = false;
						} else {
							this.snackBar.open(error,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
							);
							this.authService.adminLogout();
						}
					}
				);
		} else {

			this.snackBar.open(`Verificar los datos e intentar nuevamente!`,
								'x',
								{ duration: 5000,verticalPosition: 'top', panelClass: ['snackbar-color']}
			);
		}
	}
}