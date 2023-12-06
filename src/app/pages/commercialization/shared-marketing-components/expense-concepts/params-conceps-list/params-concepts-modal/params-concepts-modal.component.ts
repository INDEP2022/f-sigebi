import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IParameterConcept } from 'src/app/core/models/ms-comer-concepts/parameter-concept';
import { IParameterMod } from 'src/app/core/models/ms-comer-concepts/parameter-mod.model';
import { ParametersModService } from 'src/app/core/services/ms-commer-concepts/parameters-mod.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ExpenseConceptsService } from '../../services/expense-concepts.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-params-concepts-modal',
  templateUrl: './params-concepts-modal.component.html',
  styleUrls: ['./params-concepts-modal.component.scss'],
})
export class ParamsConceptsModalComponent
  extends BasePageWidhtDinamicFiltersExtra<IParameterMod>
  implements OnInit
{
  form: FormGroup;
  addressParam: string;
  conceptId: string;
  title: string = 'Parámetro del concepto';
  parameterValue: IParameterConcept = null;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private expenseConceptsService: ExpenseConceptsService,
    private parametersModService: ParametersModService
  ) {
    super();
    this.service = this.parametersModService;
    this.ilikeFilters = ['parameter', 'value', 'address'];
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS },
    };
  }

  override ngOnInit(): void {
    this.prepareForm();
    const list = [{ value: 'C', title: 'GENERAL' }];
    if (this.addressParam === 'M') {
      list.push({ value: 'M', title: 'MUEBLES' });
    }
    if (this.addressParam === 'I') {
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
    this.dinamicFilterUpdate();
    this.searchParams();
  }

  selectParamsMod(event: IParameterMod) {
    console.log(event);
    this.parameter.setValue(event.parameter);
    this.value.setValue(event.value);
    this.address.setValue(event.address);
  }

  getAddressCode(address: string) {
    return this.expenseConceptsService.getAddressCode(address);
  }

  override getParams() {
    // debugger;
    let newColumnFilters = this.columnFilters;
    if (newColumnFilters['filter.address']) {
      let filterAddress = this.getAddressCode(
        (newColumnFilters['filter.address'] + '').replace('$eq:', '')
      );
      let addresss = ['C'];
      if (this.addressParam) {
        addresss.push(this.addressParam);
      }
      if (addresss.includes(filterAddress)) {
        newColumnFilters['filter.address'] = '$eq:' + filterAddress;
      }
    } else {
      if (this.addressParam) {
        newColumnFilters['filter.address'] = '$in:' + this.addressParam + ',C';
      } else {
        newColumnFilters['filter.address'] = '$in:C';
      }
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    console.log(this.form.value);
    // if (!this.edit) {
    //   this.form.get('creationDate').setValue(secondFormatDate(new Date()));
    //   this.form.get('creationUser').setValue(secondFormatDate(new Date()));
    // }
    this.modalRef.content.callback({
      ...this.form.value,
      address: this.form.value.address,
    });
    this.modalRef.hide();
  }

  get parameter() {
    return this.form.get('parameter');
  }

  get value() {
    return this.form.get('value');
  }

  get address() {
    return this.form.get('address');
  }

  private prepareForm() {
    // debugger;
    this.form = this.fb.group({
      parameter: [null, [Validators.required]],
      value: [null, [Validators.required]],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.parameterValue !== null) {
      // this.edit = true;
      // const formattedDate = this.formatDate(this.representative.dateBorn);
      const body = {
        parameter: this.parameterValue.parameter,
        value: this.parameterValue.value,
        address: this.parameterValue.address,
      };
      this.form.patchValue({
        ...body,
        // dateBorn: formattedDate,
      });
    }
  }
}
