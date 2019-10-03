import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({
	providedIn: 'root'
})
export class LoadingService {

	constructor() { }

	showLoading() {
		$(document.getElementById('loading-main')).modal('show');
	}

	hideLoading() {
		$(document.getElementById('loading-main')).modal('hide');
	}
}
