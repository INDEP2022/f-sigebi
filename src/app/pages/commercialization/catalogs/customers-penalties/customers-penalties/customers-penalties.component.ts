import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ICustomersPenalties } from 'src/app/core/models/catalogs/customer.model';
import { ClientPenaltyService } from 'src/app/core/services/ms-clientpenalty/client-penalty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CustomersPenaltiesExportAllComponent } from '../customer-penalties-export-all/customer-penalties-export-all.component';
import { CustomerPenaltiesModalComponent } from '../customer-penalties-modal/customer-penalties-modal.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-customers-penalties',
  templateUrl: './customers-penalties.component.html',
  styles: [],
})
export class CustomersPenaltiesComponent extends BasePage implements OnInit {
  customersPenalties: ICustomersPenalties[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  penalties: ICustomersPenalties;

  constructor(
    private modalService: BsModalService,
    private clientPenaltyService: ClientPenaltyService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.hideSubHeader = false;
    /*this.settings.actions.add = false;
    this.settings.actions.edit = true;
    this.settings.actions.delete = false;
    this.settings.actions.position = 'right';*/
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            console.log('Hola');
            switch (filter.field) {
              case 'typeProcess':
                searchFilter = SearchFilter.EQ;
                break;
              case 'eventId':
                field = `filter.${filter.field}.id`;
                searchFilter = SearchFilter.EQ;
                break;
              case 'publicLot':
                searchFilter = SearchFilter.EQ;
                break;

              /*case 'startDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;*/
              case 'startDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              /*case 'endDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;*/
              case 'endDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'refeOfficeOther':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'userPenalty':
                searchFilter = SearchFilter.ILIKE;
                break;
              /*case 'penaltiDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }*/
              case 'penaltiDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDeductives();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  formatDate(dateString: string): string {
    if (dateString === '') {
      return '';
    }

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  rowsSelected(event: any) {
    this.penalties = event.data;
    console.log(this.penalties);
  }

  getDeductives() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log(params);
    this.clientPenaltyService.getAll(params).subscribe({
      next: response => {
        if (response.count > 0) {
          this.customersPenalties = response.data;
          this.totalItems = response.count;
          this.data.load(response.data);
          console.log(this.data);
          this.data.refresh();
          this.loading = false;
        } else {
          /*this.alert(
          'warning',
            'No se Encontraron Registros',
            ''
          );*/
          this.loading = false;
          this.data.load([]);
          this.data.refresh();
          this.totalItems = 0;
        }
      },
      error: error => {
        //this.loading = false;
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  //Modal para crear o editar clientes penalizados
  /*openForm(customersPenalties?: ICustomersPenalties) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      customersPenalties,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(CustomerPenaltiesModalComponent, modalConfig);
  }*/

  openForm(customersPenalties?: ICustomersPenalties) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      customersPenalties,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(CustomerPenaltiesModalComponent, modalConfig);
  }

  //Abrir modal de todos los penalizados
  openAllCustomersPenalties() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(CustomersPenaltiesExportAllComponent, modalConfig);
  }

  showDeleteAlert(customersPenalties: ICustomersPenalties) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(customersPenalties.id);
      }
    });
  }

  delete(id: number) {
    this.clientPenaltyService.remove(id).subscribe({
      next: () => {
        this.getDeductives();
        this.alert('success', 'Borrado Correctamente', '');
      },
    });
  }
}
