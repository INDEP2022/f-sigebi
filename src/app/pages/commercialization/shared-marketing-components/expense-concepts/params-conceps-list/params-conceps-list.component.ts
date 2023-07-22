import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IParameterConcept } from 'src/app/core/models/ms-comer-concepts/parameter-concept';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-params-conceps-list',
  templateUrl: './params-conceps-list.component.html',
  styleUrls: ['./params-conceps-list.component.scss'],
})
export class ParamsConcepsListComponent
  extends BasePageWidhtDinamicFiltersExtra<IParameterConcept>
  implements OnInit
{
  toggleInformation = true;
  concepto = '';
  pageSizeOptions = [5, 10, 20, 25];
  limit: FormControl = new FormControl(5);
  constructor(private parameterService: ParametersConceptsService) {
    super();
    this.params.value.limit = 5;
    this.service = this.parameterService;
    this.ilikeFilters = ['parameter', 'description'];
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS },
    };
  }

  private getAddressCode(address: string) {
    switch (address) {
      case 'MUEBLES':
        return 'M';
      case 'INMUEBLES':
        return 'I';
      case 'GENERAL':
        return 'C';
      case 'VIGILANCIA':
        return 'V';
      case 'SEGUROS':
        return 'S';
      case 'JURIDICO':
        return 'J';
      case 'ADMINISTRACIÓN':
        return 'A';
      default:
        return '';
    }
  }

  override getParams() {
    // debugger;
    let newColumnFilters = this.columnFilters;
    if (newColumnFilters['filter.address']) {
      newColumnFilters['filter.address'] =
        '$eq:' +
        this.getAddressCode(
          (newColumnFilters['filter.address'] + '').replace('$eq:', '')
        );
    }
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
