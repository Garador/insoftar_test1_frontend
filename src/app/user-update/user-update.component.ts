import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { User } from '../_lib/User.class';
import {FormBuilder, Form, FormGroup, FormControl, Validators} from '@angular/forms';
import { ModalAlertService } from '../services/alert/message.service';
import { ALERT_TYPE } from '../_lib/Alert.enum';
import { LoadingService } from '../services/loading/loading.service';

@Component({
	selector: 'app-user-update',
	templateUrl: './user-update.component.html',
	styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

	public loading: boolean;
	public error: boolean;
	public userId: string;

	errorText: string = "";

	private form: FormGroup;

	readonly fieldErrorMessages = {
		email: 'Debe proveer un email válido',
		firstName: 'Debe colocar un nombre válido (letras y espacios, de 1 a 60 caracteres)',
		lastName: 'Debe colocar un apellido válido (letras y espacios, de 1 a 60 caracteres)',
		ci: 'Debe colocar una CI válida (6 a 10 dígitos)',
		phone: 'Debe colocar un teléfono válido (8 a 15 dígitos)',
	};

	constructor(
		private route: ActivatedRoute,
		private _userService: UserService,
		private _formBuilder: FormBuilder,
		private _modalService: ModalAlertService,
		private _loadingService: LoadingService
	) {
	}

	ngOnInit() {
		this.route.paramMap.subscribe((_map) => {
			if (_map.has('id')) {
				this.userId = _map.get('id');
				this.loadRecord(this.userId);
			} else {
				console.log("_map: ");
				console.log(_map);
			}
		});
	}

	async loadRecord(id: string) {
		this.loading = true;
		this.error = false;
		this._loadingService.showLoading();
		try {
			const result = await this._userService.loadUser(id);
			if(result){
				this.initializeForm(result);
			} else {
				this.error = true;
				this.errorText = 'Registro no encontrado';
			}
		} catch (e) {
			this.error = true;
			this.errorText = e.message;
		}
		this._loadingService.hideLoading();
		this.loading = false;
	}

	initializeForm(user: User) {
		if(!user) return;
		this.form = this._formBuilder.group({
			email: new FormControl(user.email, [Validators.required, Validators.email])
			, firstName: new FormControl(user.firstName, [Validators.required, Validators.pattern(/^[a-z ]{1,60}$/i)])
			, lastName: new FormControl(user.lastName, [Validators.required, Validators.pattern(/^[a-z ]{1,60}$/i)])
			, ci: new FormControl(user.ci, [Validators.required, Validators.pattern(/^[\d]{6,10}$/i)])
			, phone: new FormControl(user.phone, [Validators.required, Validators.pattern(/^[\d]{8,15}$/i)])
		});
	}

	onSubmit(form: FormGroup) {
		if(form.dirty && form.valid){
			console.log(form.value);
			const user = new User();
			user.id = parseInt(this.userId);
			user.firstName = form.value.firstName;
			user.lastName = form.value.lastName;
			user.phone = form.value.phone;
			user.email = form.value.email;
			user.ci = form.value.ci;
			this._loadingService.showLoading();
			this._userService.updateUser(user)
			.then((data) => {
				this._loadingService.hideLoading();
				this._modalService.showMessage("Éxito",data.message, ALERT_TYPE.SUCCESS, 'main-messages-modal');
				//window.alert(data);
			})
			.catch((err) => {
				this._loadingService.hideLoading();
				//window.alert(err.message);
				this._modalService.showMessage("Error", err.message, ALERT_TYPE.ERROR, 'main-messages-modal');
			});
		}
	}

	hasValid(field: string){
		return !this.form.get(field).invalid;
	}

}
