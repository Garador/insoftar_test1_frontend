import { IUserDBRecord } from './User.interface';
import * as moment from 'moment';

export class User {

	ci: string;
	createdAt: Date;
	email: string;
	firstName: string;
	id: number;
	lastName: string;
	phone: string;
	updatedAt: Date;

	constructor(dbRecord?: IUserDBRecord) {
		//console.log({dbRecord});
		if (dbRecord) {
			this.id = dbRecord.id;
			this.ci = dbRecord.ci;
			this.createdAt = new Date(dbRecord.created_at);
			this.updatedAt = new Date(dbRecord.updated_at);
			this.email = dbRecord.email;
			this.firstName = dbRecord.first_name;
			this.lastName = dbRecord.last_name;
			this.phone = dbRecord.phone;
		}
	}

	// 2019-10-02 15:15:49
	toDBRecord(): IUserDBRecord {
		return {
			ci: this.ci,
			created_at: moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss'),
			email: this.email,
			first_name: this.firstName,
			id: this.id,
			last_name: this.lastName,
			phone: this.phone,
			updated_at: moment(this.updatedAt).format('YYYY-MM-DD HH:mm:ss')
		}
	}
}