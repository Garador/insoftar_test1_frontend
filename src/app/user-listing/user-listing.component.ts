import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { User } from '../_lib/User.class';

@Component({
	selector: 'app-user-listing',
	templateUrl: './user-listing.component.html',
	styleUrls: ['./user-listing.component.scss']
})
export class UserListingComponent implements OnInit {

	public loading = false;
	public error = false;
	public loadedRecords:User[] = [];
	public skip = 0;
	public limit = 5;

	constructor(
		private _UserService: UserService
	) {
		this.loadUsers();
	}

	ngOnInit() {
	}

	async loadUsers() {
		this.loading = true;
		this.error = false;
		try {
			this.loadedRecords = await this._UserService.loadUsers(this.skip, this.limit);
		} catch (e) {
			console.log(e);
			this.error = true;
		}
		this.loading = false;
	}

	async forward() {
		if(this.skip > 0) {
			if (!this.loading && this.loadedRecords && this.loadedRecords.length > 0 ) {
				this.skip += this.limit;
				this.loadUsers();
			}
		}else{
			this.skip += this.limit;
			this.loadUsers();
		}
	}

	async backwards() {
		if (this.skip < 0) {
			this.skip = 0;
			this.loadUsers();
		} else if (this.skip === 0){
			return;
		} else {
			this.skip -= this.limit;
			this.loadUsers();
		}
	}

}
