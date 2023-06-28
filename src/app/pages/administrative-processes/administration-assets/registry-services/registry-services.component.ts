import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ServiceGoodService } from 'src/app/core/services/ms-serviceGood/servicegood.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RegisterServiceComponent } from './register-service/register-service.component';

@Component({
  selector: 'app-registry-services',
  templateUrl: './registry-services.component.html',
  styles: [],
})
export class RegistryServicesComponent
  extends BasePage
  implements OnInit, OnChanges {
  @Input() goodId: number;
  list: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private readonly serviceGoodService: ServiceGoodService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      serviceCode: {
        title: 'Clave Servicio',
        type: 'number',
        sort: false,
      },
      serviceDescription: {
        title: 'Descripión del Servicio',
        type: 'string',
        sort: false,
      },
      periodicity: {
        title: 'Periodicidad',
        type: 'string',
        sort: false,
      },
      courtDate: {
        title: 'Fecha de Corte',
        type: 'string',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return this.formatearFecha(new Date(value));
        },
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.searchRegistryService(this.goodId);
    }
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchRegistryService(this.goodId));
  }

  searchRegistryService(idGood: number) {
    this.loading = true;
    this.params.getValue()['filter.goodNumber'] = `$eq:${idGood}`;
    console.log(this.params.getValue());
    this.serviceGoodService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.list = response.data.map(service => {
          return {
            serviceCode: service.cveService,
            serviceDescription: service.serviceCat.description,
            periodicity: service.periodicity,
            courtDate: service.dateCourt,
          };
        });
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.log(err);
      },
    });
  }

  add() {
    this.openModal();
  }
  openModal() {
    let config: ModalOptions = {
      initialState: {
        goodId: this.goodId,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.searchRegistryService(this.goodId));
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RegisterServiceComponent, config);
  }

  formatearFecha(fecha: Date) {
    let dia: any = fecha.getDate();
    let mes: any = fecha.getMonth() + 1;
    let anio: any = fecha.getFullYear();
    dia = dia < 10 ? '0' + dia : dia;
    mes = mes < 10 ? '0' + mes : mes;
    let fechaFormateada = dia + '/' + mes + '/' + anio;
    return fechaFormateada;
  }
}
