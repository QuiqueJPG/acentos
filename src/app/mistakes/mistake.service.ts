import { Injectable } from '@angular/core';
import { MistakeActivity } from './mistake.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
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
export class MistakeService {

	mistakeUrl: string;

	constructor(private http: Http,
				private router: Router,
				public snackBar: MatSnackBar){
		this.mistakeUrl = urljoin(environment.apiUrl, 'activities');
	}

	getQuestions(): Promise<void | MistakeActivity[]>{
		return this.http.get(this.mistakeUrl)
			.toPromise()
			.then(response => response.json() as MistakeActivity[])		//Exitoso
			.catch(this.handleError);								//Error
	}

	getMistakeActivity(id): Promise<void | MistakeActivity>{
		console.log(id);
		const url = urljoin(this.mistakeUrl, id);
		console.log(url);
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as MistakeActivity)
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

	addMistakeActivity(activity: MistakeActivity) {
		const body = JSON.stringify(activity);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getToken();
		const url = this.mistakeUrl + '/newMistakeActivity' + token;
		//  apiUrl: 'http://localhost:3000/api/simpleSelection?token=${token}'
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	updateMistakeActivity(activity: MistakeActivity) {
		const body = JSON.stringify(activity);
		const headers = new Headers({'Content-Type': 'application/json'});
		//const token = this.getToken();
		const url = this.mistakeUrl + '/updateActivity';
		//  apiUrl: 'http://localhost:3000/api/simpleSelection?token=${token}'
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			//.catch((error: Response) => Observable.throw(error.json()));
			.catch((error: Response) => {
				console.log(error);
				console.log(error.json());

				const res = error.json();
				
				if(res){
					console.log('Entré al if del catch service');
					console.log(res);
					if(res.message){
						
						//Error arrojado desde el servidor
						return Observable.throw(res.message);

					} else {
							
						//Error por servidor caído
						return Observable.throw('Presentamos problema con el servidor. Intenta más tarde');
					}
				}

			});
	}

	/*addAnswer(answer: Answer) {

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

	handleError(error: any) {
		const errMsg = error.message ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';

		console.log(errMsg);
	}
}