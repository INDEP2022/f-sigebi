import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IZoneGeographic } from 'src/app/core/models/catalogs/zone-geographic.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ZoneGeographicService } from 'src/app/core/services/catalogs/zone-geographic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-delegation-modal',
  templateUrl: './delegation-modal.component.html',
  styles: [],
})
export class DelegationModalComponent extends BasePage implements OnInit {
  delegationForm: ModelForm<IDelegation>;
  delegationM: IDelegation;

  title: string = 'Delegación';
  edit: boolean = false;

  idZ = new DefaultSelect<IZoneGeographic>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private readonly zoneGeographicService: ZoneGeographicService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.delegationForm = this.fb.group({
      id: [null],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      etapaEdo: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      idZoneGeographic: [null, [Validators.required]],
    });
    if (this.delegationM != null) {
      this.edit = true;
      let dele: any;
      dele = this.delegationM.idZoneGeographic;
      this.delegationForm.patchValue(this.delegationM);
      //this.getSubtypes(new ListParams(), dele.id);
      this.delegationForm.get('idZoneGeographic').setValue(dele.id);
      this.delegationForm.get('etapaEdo').disable();
      console.log(this.delegationM);
      console.log(dele.id);
    }
  }
  getZones(event: ListParams) {
    this.zoneGeographicService.getAll(event).subscribe({
      next: data => {
        this.idZ = new DefaultSelect(data.data, data.count);
      },
    });
  }

  getSubtypes(params: ListParams, id?: string | number) {
    if (id) {
      params['filter.id'] = id;
    }
    this.zoneGeographicService.getAll(params).subscribe({
      next: data => {
        this.idZ = new DefaultSelect(data.data, data.count);
        console.log(data);
      },
      error: err => {
        //this.idZ = new DefaultSelect([], 0, true);
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    /*const newDelegation = Object.assign({}, this.delegationForm.value);

    Object.defineProperty(newDelegation, 'idZoneGeographic', {
      value: newDelegation.idZoneGeographic.id,

    });
    console.log(newDelegation);

    if (this.edit) newDelegation.idZoneGeographic.id = this.delegationM.id;*/

    this.edit ? this.update() : this.create();
  }

  create() {
    if (this.delegationForm.controls['description'].value.trim() === '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    } else {
      this.loading = true;
      this.delegationService
        .create2(this.delegationForm.getRawValue())
        .subscribe({
          next: data => {
            this.handleSuccess();
          },
          error: error => (this.loading = false),
        });
    }
  }

  update() {
    if (this.delegationForm.controls['description'].value.trim() === '') {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    } else {
      console.log();
      this.loading = true;
      this.delegationService
        .update2(this.delegationForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
