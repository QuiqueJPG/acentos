import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MistakeActivity } from './mistake.model';
import { MistakeService } from './mistake.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { noWhitespaceValidator } from '../utils/noWhitespaces.validator';
import { ComponentCanDeactivate } from '../activities/session-guard.service';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-mistakes-component',
	templateUrl: './mistakes.component.html',
	styleUrls: ['./mistakes.component.css'],
	providers: [MistakeService]
})

export class MistakesComponent implements OnInit, ComponentCanDeactivate {
	activityForm: FormGroup;
	splittedString: any[];
	correctAnswer: any;
	possibleAnswers: any[]=[];
	activityWords: any[]=[];
	loading:boolean =  false;
	done: boolean = false;

	constructor(private mistakeService: MistakeService,
				private router: Router,
				private authService: AuthService,
				public snackBar: MatSnackBar){}


	// @HostListener allows us to also guard against browser refresh, close, etc.
  	@HostListener('window:beforeunload')
  	canDeactivate(): Observable<boolean> | boolean {
    	// insert logic to check if there are pending changes here;
    	// returning true will navigate without confirmation
    	// returning false will show a confirm dialog before navigating away
    	//return false;
    	if((this.activityForm.value.fullString||this.activityForm.value.difficulty||this.activityForm.value.comment)&&!this.done) {

    		return false;
    	} else {

    		return true;
    	}

  	}

	ngOnInit(){
		this.activityForm = new FormGroup({
			comment: new FormControl(null, [Validators.required, Validators.maxLength(15), noWhitespaceValidator]),
			difficulty: new FormControl(null, Validators.required),
			possibleAnswer: new FormControl(null), //Validar que solo acepte
			fullString: new FormControl(null, [Validators.required, Validators.maxLength(50)])
			/*fullString: new FormControl(null, [
				Validators.required//,
				Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),*/
		});

		this.activityForm.patchValue({
		  comment: 'Probando', 
		  // formControlName2: myValue2 (can be omitted)
		});

	}

	stringTokenizer(){
		
		this.correctAnswer=null;
		this.possibleAnswers=[];
		this.activityWords=[];


		//Obtengo el texto del formulario
		let str = this.activityForm.value.fullString;
		if(str){

			str.trim();

			//Se debe usar una expresión regular para que solo forme las palabras
			//Y guarde los signos de puntuación
			//Se separa en espacios
			//let tokens = str.split(/(;|;\s|:|:\s|,|,\s|\?|\?\s|\¿|\¿\s|\s|.|.\s)/);
			let tokens = str.split(/(;|;\s|:|:\s|,|,\s|\?|\?\s|\¿|\¿\s|\s\¿|\s|\.|\.\s|-|-\s|\s-|\!|\!\s|\¡|\¡\s|\s\¡)/);
			console.log(tokens);

			//Validar que si 'token' es un signo de puntuación, se debe colocar 'cliackeable:false'
			//Y en el cliente solo se muestran los que tengan 'clickeable:true'
			this.splittedString = tokens.map(function(token, index) {

				//Verificar si es un caracter especial, no es clickeable.
				if(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+$/.test(token)){
					this.activityWords.push({
						//id: window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now(),				
					   	id: index,
					   	word: token,
					   	hidden: false,
					   	clickeable: true,
					   	selected: false
					});

					return {
						//id: window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now(),				
					   	id: index,
					   	word: token,
					   	hidden: false,
					   	clickeable: true,
					   	selected: false
					}
				}
				return {
					//id: window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now(),
					id: index,
					word: token,
				   	hidden: false,
				   	clickeable: false,
				   	selected: false
				}   
			}, this);

			console.log(this.activityWords)
		}
		
	}

	hideAnswer(word){

		//De ser seleccionada una palabra, es decir word.hidden == false
		//Se hace word.hidden = false y
		//Se debe agregar al arreglo de respuestas correctas y de respuestas posibles
		//Analizar los casos en que se deben ocultar o no estas palabras
		//O si se les puede hacer click

		this.possibleAnswers=[];


		if(!word.hidden){
			//Si la palabra no se había seleccionado
			if(this.correctAnswer){
				this.correctAnswer.hidden=!this.correctAnswer.hidden;
				this.correctAnswer = null;
			}	
			//this.addCorrectAnswer(word);
			this.correctAnswer=word;
			
		} else {
			//this.deleteCorrectAnswer(word);
			console.log('entre al else');
			this.correctAnswer = null;
		}
		word.hidden = !word.hidden;
		console.log(this.correctAnswer);
		console.log(word);
		console.log(this.splittedString);
		//De lo contrario se debe buscar el objeto en los arreglos y luego sacarlo
	}

	addCorrectAnswer(word){
		//word.clickeable = !word.clickeable;

		this.possibleAnswers.push(word);
		/*const newAnswer = {
			id: word.id,
			word: word.word,
			hidden: false,
			clickeable: false,
			possibleAnswers: [word]
			
		}*/
		this.correctAnswer=word;
	}

	deleteCorrectAnswer(word){
		//word.clickeable = !word.clickeable;
		//Buscar el objeto y luego eliminarlo
		//this.remove(this.correctAnswer, word);
		this.correctAnswer = null;
		//this.remove(this.possibleAnswers, word);
		this.possibleAnswers=[];

	}

	addPossibleAnswer(){
		let str = this.activityForm.value.possibleAnswer;
		this.activityForm.patchValue({possibleAnswer: null});
		console.log(str);
		console.log(this.possibleAnswers.length)

		const word = {
				   	id: this.possibleAnswers.length,
				   	word: str,
				   	hidden: false,
				   	clickeable: true,
				   	selected: false
				};
		this.possibleAnswers.push(word);
	}

	deletePossibleAnswer(){
		//word.clickeable = !word.clickeable;
		//this.remove(this.possibleAnswers, word);
		this.possibleAnswers.pop();
	}

	hasOnlywords(word){}

	remove(array, element) {
	    const index = array.indexOf(element);
    
	    if (index !== -1) {
	        array.splice(index, 1);
	    }
	}

	round(value, precision) {
	    var multiplier = Math.pow(10, precision || 0);
	    return Math.round(value * multiplier) / multiplier;
	}

	onSubmit(){
		if(this.activityForm.valid){
			this.loading=true;
			const {difficulty, comment, fullString} = this.activityForm.value;
			console.log(comment);
			const difficultyNumber = this.round(parseInt(difficulty, 10) * 0.1, 1);
			//console.log(difficulty)
			const activity = new MistakeActivity(
				difficultyNumber,
				'Mistake',
				comment.trim(),
				fullString,
				this.splittedString,
				this.correctAnswer,
				this.possibleAnswers
			);
			console.log(activity);
			
			this.mistakeService.addMistakeActivity(activity)
				.subscribe(
					//( {_id} ) => this.router.navigate(['/questions', _id]),
					//this.router.navigate(['/']),
					(  ) => {
						this.done = true;
						this.snackBar.open(`Se ha creado la actividad exitosamente`,
											'x',
											{ duration: 2500, verticalPosition: 'top'}
						);
						this.router.navigate(['/admin']);
					},
					this.authService.handleError
				);//recibe dos funciones como parametros, la función de exito y la función de error*/
		} else {
			//Not valid
			this.snackBar.open(`Verificar los datos e intentar nuevamente!`,
								'x',
								{ duration: 2500, verticalPosition: 'top'}
			);
		}
	}

}