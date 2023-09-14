import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { IZoneGeographic } from 'src/app/core/models/catalogs/zone-geographic.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-delegation-form',
  templateUrl: './delegation-form.component.html',
  styles: [],
})
export class DelegationFormComponent extends BasePage implements OnInit {
  delegationForm: ModelForm<IDelegation>;
  title: string = 'Delegación';
  edit: boolean = false;
  delegation: any;
  states = new DefaultSelect<IStateOfRepublic>();
  zones = new DefaultSelect<IZoneGeographic>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private delegationService: DelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getStates(new ListParams());
    this.getZones(new ListParams());
  }

  private prepareForm() {
    this.delegationForm = this.fb.group({
      id: [null],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(150),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      diffHours: [
        null,
        [
          Validators.required,
          Validators.maxLength(6),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      zoneVigilanceKey: [
        null,
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      zoneContractKey: [
        null,
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      noRegister: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(20),
        ],
      ],
      etapaEdo: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.maxLength(10),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      stateKey: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      addressOffice: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(200),
        ],
      ],
      regionalDelegate: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(200),
        ],
      ],
      // cveZone: [null, Validators.required],
      city: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      status: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      iva: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.maxLength(10),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      idZoneGeographic: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
    });
    if (this.delegation != null) {
      this.fillForm();
    }
  }

  fillForm() {
    this.edit = true;

    this.delegationForm.get('etapaEdo').disable();
    this.delegationForm.patchValue(this.delegation);
    this.getStates(new ListParams(), this.delegation.stateKey);
    console.log(this.delegation);
  }

  getStates(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = id;
    }
    this.delegationService.getStates(params).subscribe(data => {
      this.states = new DefaultSelect(data.data, data.count);
    });
  }

  getZones(params: ListParams) {
    /*if (this.delegation && this.delegation.idZoneGeographic) {
      const { id }: any = this.delegation.idZoneGeographic;
      this.delegation.idZoneGeographic = id;
    }*/
    this.delegationService.getZones(params).subscribe(item => {
      this.zones = new DefaultSelect(item.data, item.count);
      // if (Array.isArray(this.zones.data)) {
      //   this.zones.data = this.zones.data.map(dataItem => {
      //     return {
      //       ...dataItem,
      //       idZoneGeographic: dataItem.id,
      //     };
      //   });
      // }
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.delegationService.create(this.delegationForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.delegationService
      .update(this.delegation.id, this.delegationForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
