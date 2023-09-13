import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IOrderServiceProvider } from 'src/app/core/models/ms-order-entry/order-service-provider.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
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
  orderServId: number = null;
  typeService: string = null;
  servicesSelected: any = [];
  user: any = null;

  private orderEntryService = inject(orderentryService);
  private goodsinv = inject(GoodsInvService);
  private authService = inject(AuthService);

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

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getCatServiceCost(data);
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
        console.log(this.selectServices);
        const user = this.authService.decodeToken();
        this.loader.load = true;
        this.servicesSelected.map(async (item: any, _i: number) => {
          const index = _i + 1;
          const body: IOrderServiceProvider = {
            orderServiceId: this.orderServId,
            priceUnitary: item.costConter,
            description: item.detServiceConter,
            andmidserv: item.detuomConter,
            content: item.conterId,
            disputed: item.detIdConter,
            typeService: this.typeService,
            classificationService: 'Equipo y Maniobras',
            userCreation: user.username,
            //userModification: user.username,
            creationDate: moment(new Date()).format('YYYY-MM-DD'),
          };

          const create = await this.createOrderServiceProvided(body);
          if (this.servicesSelected.length == index) {
            this.loader.load = false;
            this.modalRef.content.callback(this.form.value);
            this.onLoadToast('success', 'Servicio creado correctamente', '');
            this.close();
          }
        });
      }
    });
  }

  search() {
    const form = this.form.getRawValue();
    this.getCatServiceCost(new ListParams(), form);
  }

  clean() {
    this.form.reset();
    this.data = [];
  }
  close() {
    this.modalRef.hide();
  }

  createOrderServiceProvided(body: IOrderServiceProvider) {
    return new Promise((resolve, reject) => {
      this.orderEntryService.createServiceProvided(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          this.loader.load = false;
          reject('no se guardaron las ordenes de servicio');
          console.log('error', error);
          this.onLoadToast('error', 'No se pudo guardar los servicios');
        },
      });
    });
  }

  getCatServiceCost(params: ListParams, form?: any) {
    let body: any = {
      serviceOrderId: this.orderServId,
      serviceType: this.typeService,
    };
    this.goodsinv.getCatServiceCost(body, params.page, params.limit).subscribe({
      next: resp => {
        this.data = resp.data;
        this.totalItems = resp.count;
      },
    });
  }

  selectServices(event: any) {
    this.servicesSelected = event.selected;
  }
}
