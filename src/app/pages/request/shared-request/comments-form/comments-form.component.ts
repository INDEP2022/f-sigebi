import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IOrderServiceDTO } from 'src/app/core/models/ms-order-service/order-service.mode';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';

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

  commentsForm: FormGroup = new FormGroup({});
  orderServiceData: IOrderServiceDTO;
  constructor(
  ) { }

  ngOnInit(): void {

  }

}
