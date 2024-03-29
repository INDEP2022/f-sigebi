import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IZoneGeographic } from 'src/app/core/models/catalogs/zone-geographic.model';
import { ZoneGeographicService } from 'src/app/core/services/catalogs/zone-geographic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IVA_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-zone-geographic-form',
  templateUrl: './zone-geographic-form.component.html',
  styles: [],
})
export class ZoneGeographicFormComponent extends BasePage implements OnInit {
  zoneGeographicForm: ModelForm<IZoneGeographic>;
  title: string = 'Zona Geográficas';
  edit: boolean = false;
  zoneGeographic: IZoneGeographic;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private zoneGeographicService: ZoneGeographicService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.zoneGeographicForm = this.fb.group({
      id: [null],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      contractNumber: [null, [Validators.required]],
      version: [null],
      thirdPartySpecialized: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      vat: [null, [Validators.pattern(IVA_PATTERN)]],
      status: [null],
    });
    if (this.zoneGeographic != null) {
      this.edit = true;
      this.zoneGeographicForm.patchValue(this.zoneGeographic);
    }
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.zoneGeographicService
      .create(this.zoneGeographicForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.zoneGeographicService
      .update(this.zoneGeographic.id, this.zoneGeographicForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
