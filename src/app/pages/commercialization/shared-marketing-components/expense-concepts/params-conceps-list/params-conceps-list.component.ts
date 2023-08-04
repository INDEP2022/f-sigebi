import { Component, Input, OnInit } from '@angular/core';
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
        ...this.settings.actions,
        add: false,
      },
      columns: { ...COLUMNS },
    };
    this.haveInitialCharge = false;
    this.expenseConceptsService.refreshParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.getData();
          }
        },
      });
  }

  protected override dataNotFound() {
    this.totalItems = 0;
    this.data.load([]);
    this.data.refresh();
    this.loading = false;
    this.expenseConceptsService.haveParams = false;
  }

  override async extraOperationsGetData() {
    const dataTemp = await this.data.getAll();
    console.log(dataTemp);
    if (!dataTemp) {
      this.expenseConceptsService.haveParams = false;
      return;
    }
    if (dataTemp.length > 0) {
      this.expenseConceptsService.haveParams = true;
    } else {
      this.expenseConceptsService.haveParams = false;
    }
  }

  get selectedConcept() {
    return this.expenseConceptsService
      ? this.expenseConceptsService.concept
      : null;
  }

  get conceptId() {
    return this.selectedConcept ? this.selectedConcept.id : '';
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
          this.parameterService
            .create({
              ...body,
              conceptId: this.conceptId,
              address: this.getAddressCode(body.address),
              creationDate: secondFormatDate(new Date()),
              creationUser: localStorage.getItem('username').toUpperCase(),
            })
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe({
              next: response => {
                this.alert(
                  'success',
                  'Parámetro por Concepto de Pago ' + this.conceptId,
                  'Creado Correctamente'
                );
                this.getData();
              },
              error: err => {
                this.alert(
                  'error',
                  'ERROR',
                  'No se pudo crear el parámetro por concepto de pago ' +
                    this.conceptId
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
          this.parameterService
            .update({
              ...body,
              conceptId: this.conceptId,
              address: this.getAddressCode(body.address),
            })
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe({
              next: response => {
                this.alert(
                  'success',
                  'Parámetro por Concepto de Pago ' + this.conceptId,
                  'Actualizado Correctamente'
                );
                this.getData();
              },
              error: err => {
                this.alert(
                  'error',
                  'ERROR',
                  'No se pudo actualizar el parámetro por concepto de pago ' +
                    this.conceptId
                );
              },
            });
        }
      },
    };
    this.modalService.show(ParamsConceptsModalComponent, modalConfig);
  }

  async deleteConfirm(row: IParameterConcept) {
    const response = await this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    );
    if (response.isConfirmed) {
      this.parameterService
        .remove({
          conceptId: row.conceptId,
          parameter: row.parameter,
          value: row.value,
          address: this.getAddressCode(row.address),
        })
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            this.alert(
              'success',
              'Parámetro por Concepto de Pago',
              'Eliminado Correctamente'
            );
            this.getData();
          },
          error: err => {
            this.alert(
              'error',
              'Error',
              'No se pudo eliminar el parámetro por concepto de pago'
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
    if (this.selectedConcept) {
      newColumnFilters['filter.conceptId'] = '$eq:' + this.selectedConcept.id;
    }
    if (newColumnFilters['filter.address']) {
      let filterAddress = this.getAddressCode(
        (newColumnFilters['filter.address'] + '').replace('$eq:', '')
      );
      let addresss = ['C'];
      if (this.address) {
        addresss.push(this.address);
      }
      if (addresss.includes(filterAddress)) {
        newColumnFilters['filter.address'] = '$eq:' + filterAddress;
      }
    } else {
      if (this.address) {
        newColumnFilters['filter.address'] = '$in:' + this.address + ',C';
      } else {
        newColumnFilters['filter.address'] = '$in:C';
      }
    }
    // if (newColumnFilters['filter.address']) {
    //   newColumnFilters['filter.address'] =
    //     '$eq:' +
    //     this.getAddressCode(
    //       (newColumnFilters['filter.address'] + '').replace('$eq:', '')
    //     );
    // }
    if (newColumnFilters['filter.description']) {
      let description = newColumnFilters['filter.description'];
      delete newColumnFilters['filter.description'];
      newColumnFilters['filter.parameterFk.description'] = description;
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }
}
