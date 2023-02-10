import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-search-requests',
  templateUrl: './search-requests.component.html',
  styles: [],
})
export class SearchRequestsComponent extends BasePage implements OnInit {
  toggleSearch: boolean = true;
  searchForm: FormGroup = new FormGroup({});
  delegationItems = new DefaultSelect();
  stateItems = new DefaultSelect();
  transfereeItems = new DefaultSelect();
  emitterItems = new DefaultSelect();
  authorities: any[] = [];
  @Output() onSearch = new EventEmitter<any>();

  delegationTestData: any[] = [
    {
      id: 1,
      description: 'BAJA CALIFORNIA',
    },
    {
      id: 2,
      description: 'CHIAPAS',
    },
    {
      id: 3,
      description: 'GUANAJUATO',
    },
  ];

  stateTestData: any[] = [
    {
      id: 1,
      description: 'BAJA CALIFORNIA',
    },
    {
      id: 2,
      description: 'CHIAPAS',
    },
    {
      id: 3,
      description: 'GUANAJUATO',
    },
  ];

  transfereeTestData: any[] = [
    {
      id: 1,
      description: 'SAT - COMERCIO EXTERIOR',
    },
    {
      id: 2,
      description: 'EJEMPLO TRANSFERENTE 2',
    },
    {
      id: 3,
      description: 'EJEMPLO TRANSFERENTE 3',
    },
  ];

  emitterTestData: any[] = [
    {
      id: 1,
      description: 'EJEMPLO EMISORA 1',
    },
    {
      id: 2,
      description: 'EJEMPLO EMISORA 2',
    },
    {
      id: 3,
      description: 'EJEMPLO EMISORA 3',
    },
  ];

  authorityTestData: any[] = [
    {
      id: 1,
      description: 'A',
    },
    {
      id: 1,
      description: 'B',
    },
    {
      id: 1,
      description: 'C',
    },
  ];

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getSelectItems();
  }

  prepareForm() {
    this.searchForm = this.fb.group({
      requestNo: [null],
      authority: [null],
      transferType: [null, [Validators.pattern(STRING_PATTERN)]],
      fileNo: [null],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      domainExtinction: [null, [Validators.pattern(STRING_PATTERN)]],
      regionalDelegation: [null],
      transferFile: [null, [Validators.pattern(STRING_PATTERN)]],
      judgementType: [null, [Validators.pattern(STRING_PATTERN)]],
      state: [null],
      previousAscertainment: [null, [Validators.pattern(STRING_PATTERN)]],
      judgement: [null, [Validators.pattern(STRING_PATTERN)]],
      transferee: [null],
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]],
      emitter: [null],
      protectionNo: [null],
    });
  }

  getSelectItems() {
    // Inicializar items de selects con buscador
    this.getDelegations({ page: 1, text: '' });
    this.getStates({ page: 1, text: '' });
    this.getTransferees({ page: 1, text: '' });
    this.getEmitters({ page: 1, text: '' });
    // Llamar servicio para llenar el select de Autoridad
    this.authorities = this.authorityTestData;
  }

  getDelegations(params: ListParams) {
    // Funcion para demostrar funcionamiento de select. Reemplazar por uso de apis
    if (params.text == '') {
      this.delegationItems = new DefaultSelect(this.delegationTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.delegationTestData.filter((i: any) => i.id == id)];
      this.delegationItems = new DefaultSelect(item[0], 1);
    }
  }

  getStates(params: ListParams) {
    // Funcion para demostrar funcionamiento de select. Reemplazar por uso de apis
    if (params.text == '') {
      this.stateItems = new DefaultSelect(this.stateTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.stateTestData.filter((i: any) => i.id == id)];
      this.stateItems = new DefaultSelect(item[0], 1);
    }
  }

  getTransferees(params: ListParams) {
    // Funcion para demostrar funcionamiento de select. Reemplazar por uso de apis
    if (params.text == '') {
      this.transfereeItems = new DefaultSelect(this.transfereeTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.transfereeTestData.filter((i: any) => i.id == id)];
      this.transfereeItems = new DefaultSelect(item[0], 1);
    }
  }

  getEmitters(params: ListParams) {
    // Funcion para demostrar funcionamiento de select. Reemplazar por uso de apis
    if (params.text == '') {
      this.emitterItems = new DefaultSelect(this.emitterTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.emitterTestData.filter((i: any) => i.id == id)];
      this.emitterItems = new DefaultSelect(item[0], 1);
    }
  }

  search() {
    // console.log(this.searchForm.controls);
    let emptyCount: number = 0;
    let controlCount: number = 0;
    for (const c in this.searchForm.controls) {
      if (
        this.searchForm.controls[c].value === null ||
        this.searchForm.controls[c].value === ''
      ) {
        emptyCount += 1;
      }
      controlCount += 1;
    }
    if (emptyCount === controlCount) {
      this.onLoadToast(
        'error',
        'Debe completar al menos un campo',
        'Complete los campos necesarios para realizar la búsqueda'
      );
      return;
    }
    this.onSearch.emit(this.searchForm.value);
    this.toggleSearch = false;
  }

  reset() {
    this.searchForm.reset();
  }
}
