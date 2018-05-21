import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
//Models
import { User } from '../auth/user.model';
import { Activity } from './activity.model';
//import { Activity } from './activity.model';
//import { SelectionActivity } from './selectionActivity.model';
//import { Answer } from '../answer/answer.model';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';
//import urljoin from 'url-join';
import * as urljoin from 'url-join';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AdminService {

	adminUrl: string;

	constructor(private http: Http,
				private router: Router,
				public snackBar: MatSnackBar){
		this.adminUrl = urljoin(environment.apiUrl, 'admin');
	}

	getUsers(): Promise<void | User[]>{
		return this.http.get(this.adminUrl+'/users')
			.toPromise()
			.then(response => response.json() as User[])		//Exitoso
			.catch((response) => {
				const res = response.json();
					if(res){
						this.snackBar.open(`Presentamos problema con el servidor. Intenta más tarde`,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);
						this.router.navigateByUrl('/admin');
					}
			});								//Error
	}

	getUser(id): Promise<void | User>{
		const url = urljoin(this.adminUrl, 'user', id);
		console.log(url);
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as User)		//Exitoso
			.catch(this.handleError);								//Error
	}

	getActivities(): Promise<void | Activity[]>{
		return this.http.get(this.adminUrl+'/activities')
			.toPromise()
			.then(response => response.json() as Activity[])		//Exitoso
			.catch((response) => {
				console.log('Catch del mistake service');
				const res = response.json();
				
				if(res){
					console.log('Entré al if del catch service');
					console.log(res);
					if(res.message){
						
						//Error arrojado desde el servidor
						throw new Error(res.message);
					} else {
							
						//Error por servidor caído
						throw new Error('Presentamos problema con el servidor. Intenta más tarde');
					}
				}
			});	
	}

	updateUser(user: User) {
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		//const token = this.getToken();
		const url = this.adminUrl + '/updateUser';
		//  apiUrl: 'http://localhost:3000/api/simpleSelection?token=${token}'
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	deleteActivity(activityId) {
		//Obtener adminToken y asignarlo al body
		const body = JSON.stringify({_id: activityId});
		const headers = new Headers({'Content-Type': 'application/json'});
		//const token = this.getAdminToken();
		//const url = this.activitiesUrl + '/updateActivities' + token;
		const url = this.adminUrl + '/deleteActivity';

		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				console.log(error);
				console.log(error.json());

				const res = error.json();
				
				if(res){
					console.log('Entré al if del catch service');
					console.log(res);
					if(res.message){
						
						//Error arrojado desde el servidor
						//throw new Error(res.message);
						return Observable.throw(res.message);

					} else {
							
						//Error por servidor caído
						//throw new Error('Presentamos problema con el servidor. Intenta más tarde');
						return Observable.throw('Presentamos problema con el servidor. Intenta más tarde');
					}
				}

			}
			);
			/*.catch((response) => {
				console.log('Catch del admin service');
				const res = response.json();
				
				if(res){
					console.log('Entré al if del catch service');
					console.log(res);
					if(res.message){
						
						//Error arrojado desde el servidor
						throw new Error(res.message);
					} else {
							
						//Error por servidor caído
						throw new Error('Presentamos problema con el servidor. Intenta más tarde');
					}
				}
			});*/

	}

	deleteUser(userId) {
		//Obtener adminToken y asignarlo al body
		const body = JSON.stringify({_id: userId});
		const headers = new Headers({'Content-Type': 'application/json'});
		//const token = this.getAdminToken();
		//const url = this.activitiesUrl + '/updateActivities' + token;
		const url = this.adminUrl + '/deleteUser';

		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/*getMistakeActivities(): Promise<void | SelectionActivity[]>{
		const token = this.getToken();
		const url = this.activitiesUrl+ '/mistakes' + token;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as SelectionActivity[])		//Exitoso
			.catch(this.handleError);								//Error
	}

	getSelectionActivities(): Promise<void | SelectionActivity[]>{
		const token = this.getToken();
		const url = this.activitiesUrl+ '/selection' + token;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as SelectionActivity[])		//Exitoso
			.catch(this.handleError);								//Error
	}

	updateActivities(activities: SelectionActivity[]) {
		const body = JSON.stringify(activities);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getToken();
		const url = this.activitiesUrl + '/updateActivities' + token;
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	getQuestion(id): Promise<void | Question>{
		const url = urljoin(this.questionsUrl, id);
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as Question)
			.catch(this.handleError);
	}

	addQuestion(question: Question) {
		const body = JSON.stringify(question);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getToken();
		const url = this.questionsUrl + token;
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	addAnswer(answer: Answer) {

		const a = {
			description: answer.description,
			question: {
				_id: answer.question._id
			}
		}

		const body = JSON.stringify(a);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getToken();
		//const url = urljoin(this.questionsUrl, answer.question._id, 'answers'); //en strings los aspectos de la ruta que no son parametros
		return this.http.post(`${this.questionsUrl}/${answer.question._id}/answers${token}`, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}*/

	getToken(){
		const token = localStorage.getItem('token');
		return `?token=${token}`;
	}

	getAdminToken(){
		const token = localStorage.getItem('adminToken');
		return `?token=${token}`;
	}

	handleError(error: any) {
		console.log('Entré al catch de admin service');
		console.log(error);
		const errMsg = error.message ? error.message :
		error.status ? `${error.status} - ${error.statusText}` : 'Presentamos problemas con el servidor. Intenta más tarde';
		
	}
}