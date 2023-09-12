import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IOrderServiceProvider } from 'src/app/core/models/ms-order-entry/order-service-provider.model';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SERVICE_COLUMNS } from './service-columns';

@Component({
  selector: 'app-create-service-form',
  templateUrl: './create-service-form.component.html',
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
export class CreateServiceFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  data: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  showSearchForm: boolean = true;

  private orderEntryService = inject(orderentryService);

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: SERVICE_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      description: [null],
    });
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea agregar un nuevo servicio?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        //this.createOrderServiceProvided()
      }
    });
  }

  search() {
    const form = this.form.getRawValue();
  }

  clean() {
    this.form.reset();
    this.data = [];
  }
  close() {
    this.modalRef.hide();
  }

  createOrderServiceProvided(body: IOrderServiceProvider) {
    this.orderEntryService.createServiceProvided(body).subscribe({
      next: resp => {
        this.modalRef.content.callback(this.form.value);
        this.onLoadToast('success', 'Servicio creado correctamente', '');
        this.close();
      },
    });
  }
}
