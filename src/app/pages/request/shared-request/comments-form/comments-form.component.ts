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

  showComments: boolean = true;
  readonly: boolean = false;
  readonlyNotification: boolean = false;

  commentsForm: FormGroup = new FormGroup({});
  orderServiceData: IOrderServiceDTO;
  constructor(
    private fb: FormBuilder,
    private orderServiceService: OrderServiceService
  ) {}

  ngOnInit(): void {
    this.getOrderService();
    this.prepareForm();
    this.checkReadOnly();
  }

  getOrderService() {
    const params = new ListParams();
    params['filter.programmingId'] = `$eq:${this.programmingId}`;
    this.orderServiceService.getAllOrderService(params).subscribe({
      next: response => {
        this.orderServiceData = response.data[0];
        if (this.orderServiceData?.observation) {
          this.commentsForm
            .get('observations')
            .setValue(this.orderServiceData.observation);
        }

        if (this.orderServiceData?.notes) {
          this.commentsForm.get('note').setValue(this.orderServiceData.notes);
        }

        if (this.orderServiceData?.commentRejection) {
          this.commentsForm
            .get('commentRejection')
            .setValue(this.orderServiceData.commentRejection);
        }
      },
    });
  }

  checkReadOnly() {
    if (this.op == 1) {
      this.readonly = true;
      this.readonlyNotification = true;
    } else if (this.op == 9) {
      this.readonly = false;
      this.readonlyNotification = true;
    }
    /*this.readonly = this.op == 1 && this.op != 9 ? false : true;
    this.readonlyNotification = this.op == 9 ? true : false; */
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.showForm) {
      this.readonly = false;
    }

    if (this.showForm == true && this.op == 2) {
      this.readonly = true;
      this.readonlyNotification = true;
    }

    if (this.showForm == true && this.op != 2) {
      this.readonly = true;
      this.readonlyNotification = true;
    }
  }

  prepareForm() {
    this.commentsForm = this.fb.group({
      observations: [null],
      note: [null],
      commentRejection: [null],
    });
  }
}
