import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IOrderServiceDTO } from 'src/app/core/models/ms-order-service/order-service.mode';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-rejection-comment-form',
  templateUrl: './rejection-comment-form.component.html',
  styles: [],
})
export class RejectionCommentFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  folio: string = '';
  orderServiceId: number = 0;
  orderServiceInfo: IOrderServiceDTO;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private orderServiceService: OrderServiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.showInfoOrderService();
    this.prepareForm();
  }

  showInfoOrderService() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.orderServiceId;
    this.orderServiceService.getAllOrderService(params.getValue()).subscribe({
      next: response => {
        this.orderServiceInfo = response.data[0];
        this.folio = this.orderServiceInfo.serviceOrderFolio;
        if (this.orderServiceInfo?.commentRejection) {
          this.form
            .get('comments')
            .setValue(this.orderServiceInfo?.commentRejection);
        }
      },
      error: () => {},
    });
  }
  prepareForm() {
    this.form = this.fb.group({
      comments: [null, [Validators.required, Validators.maxLength(500)]],
    });
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      `¿Desea rechazar la orden de servicio con folio ${this.folio}?`
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        const orderServiceBody: IOrderServiceDTO = {
          id: this.orderServiceInfo.id,
          commentRejection: this.form.get('comments').value,
        };
        this.orderServiceService
          .updateOrderService(orderServiceBody)
          .subscribe({
            next: () => {
              this.alert(
                'success',
                'Correcto',
                'Órden de servicio rechazada correctamente'
              );
              this.loading = false;
              this.close();
            },
            error: () => {
              this.loading = false;
              this.alert(
                'error',
                'Error',
                'Error al rechazar la órden de servicio'
              );
            },
          });
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
