import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IParameterConcept } from 'src/app/core/models/ms-comer-concepts/parameter-concept';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { secondFormatDate } from 'src/app/shared/utils/date';
import { ExpenseConceptsService } from '../services/expense-concepts.service';
import { COLUMNS } from './columns';
import { ParamsConceptsModalComponent } from './params-concepts-modal/params-concepts-modal.component';

@Component({
  selector: 'app-params-conceps-list',
  templateUrl: './params-conceps-list.component.html',
  styleUrls: ['./params-conceps-list.component.scss'],
})
export class ParamsConcepsListComponent
  extends BasePageWidhtDinamicFiltersExtra<IParameterConcept>
  implements OnInit
{
  @Input() address: string;
  @Input() readonly = false;
  @Input() conceptId: string;
  toggleInformation = true;
  // concepto = '';
  pageSizeOptions = [5, 10, 20, 25];
  limit: FormControl = new FormControl(5);
  disabled = false;
  constructor(
    private modalService: BsModalService,
    private parameterService: ParametersConceptsService,
    private expenseConceptsService: ExpenseConceptsService,
    private securityService: SecurityService
  ) {
    super();
    this.params.value.limit = 5;
    this.service = this.parameterService;
    this.ilikeFilters = ['parameter', 'description'];
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
      columns: { ...COLUMNS },
    };
    this.haveInitialCharge = false;
    // this.expenseConceptsService.refreshParams
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe({
    //     next: response => {
    //       if (response) {
    //         this.getData();
    //       }
    //     },
    //   });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['address'] && changes['address'].currentValue) {
      const list = [{ value: 'C', title: 'GENERAL' }];
      if (changes['address'].currentValue === 'M') {
        list.push({ value: 'M', title: 'MUEBLES' });
      }
      if (changes['address'].currentValue === 'I') {
        list.push({ value: 'I', title: 'INMUEBLES' });
      }
      this.settings = {
        ...this.settings,
        columns: {
          ...COLUMNS,
          address: {
            ...COLUMNS.address,
            filter: {
              type: 'list',
              config: {
                selectText: 'Seleccionar',
                list,
              },
            },
          },
        },
      };
    }
    if (changes['readonly']) {
      if (changes['readonly'].currentValue === true) {
        this.settings = {
          ...this.settings,
          actions: null,
          columns: { ...COLUMNS },
        };
      } else {
        this.settings = {
          ...this.settings,
          actions: {
            columnTitle: 'Acciones',
            position: 'right',
            add: false,
            edit: true,
            delete: false,
          },
          columns: { ...COLUMNS },
        };
      }
    }
    if (changes['conceptId'] && changes['conceptId'].currentValue) {
      this.columnFilters = [];
      this.data.setFilter([], true, false);
      // this.data.load([]);
      this.getData();
    }
  }

  get haveParams() {
    return this.expenseConceptsService.haveParams ?? false;
  }

  set haveParams(value) {
    this.expenseConceptsService.haveParams = value;
  }

  protected override dataNotFound() {
    this.totalItems = 0;
    this.data.load([]);
    this.data.refresh();
    this.loading = false;
    this.haveParams = false;
  }

  override async extraOperationsGetData() {
    const dataTemp = await this.data.getAll();
    if (!dataTemp) {
      this.haveParams = false;
      return;
    }
    if (dataTemp.length > 0) {
      this.haveParams = true;
    } else {
      this.haveParams = false;
    }
  }

  private createParam(body: {
    parameter: string;
    value: string;
    address: string;
  }) {
    return this.parameterService
      .create({
        ...body,
        conceptId: this.conceptId,
        creationDate: secondFormatDate(new Date()),
        creationUser: localStorage.getItem('username').toUpperCase(),
      })
      .pipe(takeUntil(this.$unSubscribe));
  }

  openModalCreate() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      conceptId: this.conceptId,
      addressParam: this.address,
      callback: (body: {
        parameter: string;
        value: string;
        address: string;
      }) => {
        if (body) {
          console.log(body);
          this.createParam(body).subscribe({
            next: response => {
              this.alert(
                'success',
                'Se creo el parámetro por concepto de pago ' + this.conceptId,
                ''
              );
              this.getData();
            },
            error: err => {
              console.log(err);

              this.alert(
                'error',
                'No se pudo crear el parámetro por concepto de pago ' +
                  this.conceptId,
                err.error.message
              );
            },
          });
        }
      },
    };
    this.modalService.show(ParamsConceptsModalComponent, modalConfig);
  }

  openModalEdit(row: IParameterConcept) {
    console.log(row);
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      conceptId: this.conceptId,
      parameterValue: row,
      addressParam: this.address,
      edit: true,
      callback: (body: {
        parameter: string;
        value: string;
        address: string;
      }) => {
        if (body) {
          console.log(body);
          this.deleteParam(row).subscribe({
            next: response => {
              this.createParam(body).subscribe({
                next: response => {
                  this.alert(
                    'success',
                    'Se pudo actualizar el parámetro con concepto de pago ' +
                      this.conceptId,
                    ''
                  );
                  this.getData();
                },
                error: err => {
                  this.alert(
                    'error',
                    'No se pudo actualizar el parámetro ' +
                      row.parameter +
                      ' con concepto de pago ' +
                      this.conceptId,
                    err.error.message
                  );
                },
              });
            },
            error: err => {
              this.alert(
                'error',
                'No se pudo actualizar el parámetro ' +
                  row.parameter +
                  ' con concepto de pago ' +
                  this.conceptId,
                err.error.message
              );
            },
          });
        }
      },
    };
    this.modalService.show(ParamsConceptsModalComponent, modalConfig);
  }

  private deleteParam(row: IParameterConcept) {
    return this.parameterService
      .remove({
        conceptId: row.conceptId,
        parameter: row.parameter,
        value: row.value,
        address: row.address,
      })
      .pipe(takeUntil(this.$unSubscribe));
  }

  async deleteConfirm(row: IParameterConcept) {
    console.log(row);

    const response = await this.alertQuestion(
      'warning',
      'Eliminación Parámetro',
      '¿Desea eliminar este registro?'
    );
    if (response.isConfirmed) {
      this.deleteParam(row).subscribe({
        next: response => {
          this.alert(
            'success',
            'Se ha eliminado el parámetro ' + row.parameter,
            ''
          );
          this.getData();
        },
        error: err => {
          this.alert(
            'error',
            'No se pudo eliminar el parámetro ' + row.parameter,
            ''
          );
        },
      });
    }
  }

  getAddressCode(address: string) {
    return this.expenseConceptsService.getAddressCode(address);
  }

  override getParams() {
    // debugger;
    let newColumnFilters = this.columnFilters;
    if (this.conceptId) {
      newColumnFilters['filter.conceptId'] = '$eq:' + this.conceptId;
    }
    if (newColumnFilters['filter.description']) {
      let description = newColumnFilters['filter.description'];
      delete newColumnFilters['filter.description'];
      newColumnFilters['filter.parameterFk.description'] = description;
    }

    if (newColumnFilters['filter.address']) {
      return {
        ...this.params.getValue(),
        ...newColumnFilters,
      };
    } else {
      if (this.address) {
        newColumnFilters['filter.address'] = '$in:' + this.address + ',C';
      } else {
        newColumnFilters['filter.address'] = '$in:C';
      }
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }
}
