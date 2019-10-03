import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { User } from '../_lib/User.class';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalAlertService } from '../services/alert/message.service';
import { ALERT_TYPE } from '../_lib/Alert.enum';
import { LoadingService } from '../services/loading/loading.service';

@Component({
	selector: 'app-user-create',
	templateUrl: './user-create.component.html',
	styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

	public loading: boolean;
	public error: boolean;
	errorText = '';

	private form: FormGroup;

	readonly fieldErrorMessages = {
		email: 'Debe proveer un email válido',
		firstName: 'Debe colocar un nombre válido (letras y espacios, de 1 a 60 caracteres)',
		lastName: 'Debe colocar un apellido válido (letras y espacios, de 1 a 60 caracteres)',
		ci: 'Debe colocar una CI válida (6 a 10 dígitos)',
		phone: 'Debe colocar un teléfono válido (8 a 15 dígitos)',
	};

	constructor(
		private _userService: UserService,
		private _formBuilder: FormBuilder,
		private modalService: ModalAlertService,
		private loadingService: LoadingService
	) {
	}

	ngOnInit() {
		this.initializeForm();
	}


	initializeForm() {
		this.form = this._formBuilder.group({
			email: new FormControl(null, [Validators.required, Validators.email])
			, firstName: new FormControl(null, [Validators.required, Validators.pattern(/^[a-z ]{1,60}$/i)])
			, lastName: new FormControl(null, [Validators.required, Validators.pattern(/^[a-z ]{1,60}$/i)])
			, ci: new FormControl(null, [Validators.required, Validators.pattern(/^[\d]{6,10}$/i)])
			, phone: new FormControl(null, [Validators.required, Validators.pattern(/^[\d]{8,15}$/i)])
		});
	}

	onSubmit(form: FormGroup) {
		if (form.dirty && form.valid) {
			console.log(form.value);
			const user = new User();
			user.firstName = form.value.firstName;
			user.lastName = form.value.lastName;
			user.phone = form.value.phone;
			user.email = form.value.email;
			user.ci = form.value.ci;
			this.loadingService.showLoading();
			this._userService.createUser(user)
			.then((data) => {
				this.loadingService.hideLoading();
				this.modalService.showMessage("Éxito", data.message, ALERT_TYPE.SUCCESS, "main-messages-modal");
			})
			.catch((err) => {
				this.loadingService.hideLoading();
				this.error = true;
				this.errorText = err.message;
				this.modalService.showMessage("Error", err.message, ALERT_TYPE.ERROR, "main-messages-modal");
			});
		}
	}

	hasValid(field: string) {
		return !this.form.get(field).invalid;
	}

}
