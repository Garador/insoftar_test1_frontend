import { Component, OnInit, Input } from '@angular/core';
import { ModalAlertService } from '../services/alert/message.service';
import { ALERT_TYPE } from '../_lib/Alert.enum';

declare var $:any;

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss']
})
export class ModalAlertComponent implements OnInit {

  title = 'Atención';
  message = 'Mensaje';
  type: ALERT_TYPE;

  @Input("modal_id")
  modal_id: string;

  constructor(
    private _ModalAlertService:ModalAlertService
  ) { }

  ngOnInit() {
    console.log(this.modal_id);
    this._ModalAlertService.emitter.on(`NEW_MESSAGE_${this.modal_id}`, (data) => this.setData(data));
  }

  setData(data:{title: string, message: string, type: ALERT_TYPE}){
    console.log("Setting data: ",data);
    this.title = data.title;
    this.message = data.message;
    this.type = data.type;
    $(document.getElementById(this.modal_id)).modal('show');
    console.log($(this.modal_id).modal());
  }

}
