import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRequestResponse } from 'src/app/_lib/Response.interface';
import { IUserDBRecord } from 'src/app/_lib/User.interface';
import { User } from 'src/app/_lib/User.class';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor(private _httpClient: HttpClient) {
	}

	async loadUsers(skip: number = 0, limit: number = 10) {
		try{
			const data = await this._httpClient.get(`http://localhost:8000/api/user?skip=${skip}&limit=${limit}`).toPromise() as IRequestResponse;
			return this._parseUsers(data);
		}catch(e){
			throw {code: e.status, message: 'Error en el servidor'};
		}
	}

	private _parseUsers(data: IRequestResponse){
		const response: IUserDBRecord[] = data.data;
		return response.map((element) => new User(element));
	}

	async loadUser(userId: string): Promise< User>{
		try{
			const data = await this._httpClient.get(`http://localhost:8000/api/user/${userId}`).toPromise() as IRequestResponse;
			if (data.success) {
				return new User(data.data);
			} else{
				return null;
			}
		} catch (e) {
			switch(e.status){
				case 404: throw {code: 404, message: 'Usuario no encontrado'};
				default: throw {code: e.status, message: 'Error en el servidor'};
			}
		}
	}

	async updateUser(user: User) {
		try{
			const data = await this._httpClient.put(`http://localhost:8000/api/user/${user.id}`, user.toDBRecord()).toPromise() as IRequestResponse;
			if(data.success){
				return {message:"Usuario actualizado correctamente", data:data};
			}
			throw {code: 200, message:"Error actualizando al usuario"};
		}catch(e){
			switch(e.status){
				case 404: throw {code: 404, message: 'Usuario no encontrado'};
				case 409:
					const message = e.error.data.field === 'email' ? 'El mismo email ya ha sido registrado con otro usuario' : 'La misma CI ya ha sido registrada con otro usuario';
					throw {code: e.status, message};
				default: throw {code: e.status, message: 'Error en el servidor'};
			}
		}
	}

	async createUser(user: User) {
		try {
			const data = await this._httpClient.post(`http://localhost:8000/api/user`, user.toDBRecord()).toPromise() as IRequestResponse;
			if (data.success) {
				return {message: 'Usuario creado correctamente', data};
			}
			return {message: 'Error creando al usuario'};
		} catch (e) {
			switch (e.status) {
				case 409:
					const message = e.error.data.field === 'email' ? 'El mismo email ya ha sido registrado' : 'La misma CI ya ha sido registrada';
					throw {code: e.status, message};
				case 400:
					throw {code: e.status, message: 'Datos incorrectos.'}
				default: throw {code: e.status, message: 'Error en el servidor'};
			}
		}


	}
}
