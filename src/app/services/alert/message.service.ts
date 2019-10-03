import { Injectable } from '@angular/core';
import { ALERT_TYPE } from 'src/app/_lib/Alert.enum';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class ModalAlertService {

  public emitter: EventEmitter = new EventEmitter();

  constructor() { }

  showMessage(title: string, message: string, type: ALERT_TYPE, modalId: string) {
    this.emitter.emit(`NEW_MESSAGE_${modalId}`, {title, message, type});
  }


}
