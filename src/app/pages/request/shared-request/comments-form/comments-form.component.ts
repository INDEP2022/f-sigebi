import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IOrderServiceDTO } from 'src/app/core/models/ms-order-service/order-service.mode';

@Component({
  selector: 'app-comments-form',
  templateUrl: './comments-form.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class CommentsFormComponent implements OnInit {
  @Input() op: number = 0;
  @Input() showForm: boolean;
  @Input() programmingId: number = 0;
  @Input() ordServform: FormGroup = new FormGroup({});
  @Input() readonly: boolean = false;
  showComments: boolean = true;
  readonlyNotification: boolean = false;
  reject: boolean = false;

  commentsForm: FormGroup = new FormGroup({});
  orderServiceData: IOrderServiceDTO;
  constructor() {}

  ngOnInit(): void {}

  getViewReject() {
    return this.ordServform.get('commentRejection').value;
  }

  getViewJustification() {
    return this.ordServform.get('justification').value;
  }

  getViewJustificationReport() {
    return this.ordServform.get('justificationReport').value;
  }
}
