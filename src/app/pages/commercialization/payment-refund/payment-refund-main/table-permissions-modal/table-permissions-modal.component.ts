import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { PaymentDevolutionService } from 'src/app/core/services/ms-paymentdevolution/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CreationPermissionsModalComponent } from '../creation-permissions-modal/creation-permissions-modal.component';
import { PaysService } from '../services/services';
import { CREATION_PERMISSIONS_COLUMNS } from './creation-permissions-columns';

@Component({
  selector: 'app-table-permissions-modal',
  templateUrl: './table-permissions-modal.component.html',
  styles: [],
})
export class TablePermissionsModalComponent extends BasePage implements OnInit {
  title: 'Permisos de Creación';
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any[] = [];
  totalItems: number = 0;
  // paysService: any;
  constructor(
    private svPaymentDevolutionService: PaymentDevolutionService,
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private paysService: PaysService
  ) {
    super();
    this.settings.columns = CREATION_PERMISSIONS_COLUMNS;
    this.settings.actions = {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: true,
      delete: true,
    };
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.filterTable1();
  }

  filterTable1() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              user: () => (searchFilter = SearchFilter.ILIKE),
              name: () => (searchFilter = SearchFilter.EQ),
              _indGuarantee: () => (searchFilter = SearchFilter.EQ),
              _inddisp: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  async getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['sortBy'] = `user:ASC`;
    if (params['filter._indGuarantee']) {
      params['filter.indGuarantee'] = params['filter._indGuarantee'] + '';
      delete params['filter._indGuarantee'];
    }
    if (params['filter._inddisp']) {
      params['filter.inddisp'] = params['filter._inddisp'] + '';
      delete params['filter._inddisp'];
    }
    let res: any = await this.paysService.getCrtlCreate(params);
    let result = res.data.map(async item => {
      let params_ = new ListParams();
      params_['filter.id'] = `$eq:${item.user}`;
      params_.limit = 1;

      let res: any = await this.paysService.segUsers(params_);
      if (res) item['name'] = res.name;
      else item['name'] = '';

      item['_indGuarantee'] = item.indGuarantee == 1 ? true : false;
      item['_inddisp'] = item.inddisp == 1 ? true : false;
    });
    Promise.all(result).then(resp => {
      this.data.load(res.data);
      this.data.refresh();
      this.totalItems = res.count;
      this.loading = false;
    });
  }

  close() {
    this.modalRef.hide();
  }

  openFolioModal(data?: any) {
    let config: ModalOptions = {
      initialState: {
        data_: data,
        callback: (next: boolean) => {
          if (next) {
            this.getData();
          }
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CreationPermissionsModalComponent, config);
  }

  deleteRegistro(data: any) {
    // console.log("data", data)
    this.alertQuestion(
      'question',
      'Se eliminará el registro',
      '¿Desea Continuar?'
    ).then(async question => {
      if (question.isConfirmed) {
        delete data.name;
        let res = await this.paysService.deleteCrtlCreate(data, data.user);
        if (res)
          this.alert('success', 'Registro eliminado correctamente', ''),
            this.getData();
        else this.alert('warning', 'No se pudo eliminar el registro', '');
      }
    });
  }
}
