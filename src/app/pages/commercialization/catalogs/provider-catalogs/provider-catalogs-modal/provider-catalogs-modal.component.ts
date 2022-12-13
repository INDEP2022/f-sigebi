import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  RFCCURP_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-provider-catalogs-modal',
  templateUrl: './provider-catalogs-modal.component.html',
  styles: [],
})
export class ProviderCatalogsModalComponent extends BasePage implements OnInit {
  title: string = 'Proveedor';
  provider: any;
  edit: boolean = false;
  cityItems = new DefaultSelect();
  stateItems = new DefaultSelect();
  countryItems = new DefaultSelect();
  providerForm: FormGroup = new FormGroup({});
  @Output() onConfirm = new EventEmitter<any>();

  cityTestData = [
    {
      id: 1,
      description: 'CIUDAD 1',
    },
    {
      id: 2,
      description: 'CIUDAD 2',
    },
    {
      id: 3,
      description: 'CIUDAD 3',
    },
    {
      id: 4,
      description: 'CIUDAD 4',
    },
    {
      id: 5,
      description: 'CIUDAD 5',
    },
  ];

  stateTestData = [
    {
      id: 1,
      description: 'ESTADO 1',
    },
    {
      id: 2,
      description: 'ESTADO 2',
    },
    {
      id: 3,
      description: 'ESTADO 3',
    },
    {
      id: 4,
      description: 'ESTADO 4',
    },
    {
      id: 5,
      description: 'ESTADO 5',
    },
  ];

  countryTestData = [
    {
      id: 1,
      description: 'PAÍS 1',
    },
    {
      id: 2,
      description: 'PAÍS 2',
    },
    {
      id: 3,
      description: 'PAÍS 3',
    },
    {
      id: 4,
      description: 'PAÍS 4',
    },
    {
      id: 5,
      description: 'PAÍS 5',
    },
  ];

  typeTestData = [
    {
      type: 'S',
      description: 'TIPO 1',
    },
    {
      type: 'P',
      description: 'TIPO 2',
    },
    {
      type: 'D',
      description: 'TIPO 3',
    },
  ];

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getCities({ inicio: 1, text: '' });
    this.getStates({ inicio: 1, text: '' });
    this.getCountries({ inicio: 1, text: '' });
  }

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      rfc: [null, Validators.pattern(RFCCURP_PATTERN)],
      curp: [null, [Validators.required, Validators.pattern(RFCCURP_PATTERN)]],
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      street: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      neighborhood: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegation: [null, Validators.pattern(STRING_PATTERN)],
      state: [null],
      city: [null],
      country: [null],
      cp: [null, Validators.pattern(STRING_PATTERN)],
      phone: [null, Validators.pattern(PHONE_PATTERN)],
      fax: [null],
      email: [null, Validators.pattern(EMAIL_PATTERN)],
      type: [null],
      activity: [null, Validators.pattern(STRING_PATTERN)],
      contractNumber: [null, Validators.pattern(NUMBERS_PATTERN)],
    });
    if (this.provider !== undefined) {
      this.edit = true;
      this.providerForm.patchValue(this.provider);
    } else {
      this.providerForm.controls['country'].setValue('MÉXICO');
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para agregar control
    this.loading = false;
    this.onConfirm.emit(this.providerForm.value);
    this.modalRef.hide();
  }

  getCities(params: ListParams) {
    if (params.text == '') {
      this.cityItems = new DefaultSelect(this.cityTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.cityTestData.filter((i: any) => i.id == id)];
      this.cityItems = new DefaultSelect(item[0], 1);
    }
  }

  getStates(params: ListParams) {
    if (params.text == '') {
      this.stateItems = new DefaultSelect(this.stateTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.stateTestData.filter((i: any) => i.id == id)];
      this.stateItems = new DefaultSelect(item[0], 1);
    }
  }
  getCountries(params: ListParams) {
    if (params.text == '') {
      this.countryItems = new DefaultSelect(this.countryTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.countryTestData.filter((i: any) => i.id == id)];
      this.countryItems = new DefaultSelect(item[0], 1);
    }
  }
}
