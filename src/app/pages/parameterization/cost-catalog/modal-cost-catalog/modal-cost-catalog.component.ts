import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IServiceCat } from 'src/app/core/models/catalogs/service-cat.model';
import { ServiceCatService } from 'src/app/core/services/catalogs/service-cat.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CostCatalogService } from '../cost-catalog.service';

@Component({
  selector: 'app-modal-cost-catalog',
  templateUrl: './modal-cost-catalog.component.html',
  styles: [],
})
export class ModalCostCatalogComponent extends BasePage implements OnInit {
  title: string = 'Catálogo de costo';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: IServiceCat;
  isChecked: boolean = false;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private catalogService: CostCatalogService,
    private serviceCatService: ServiceCatService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      code: [
        null,
        [
          Validators.required,
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(200),
        ],
      ],
      subaccount: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(4),
        ],
      ],
      unaffordabilityCriterion: [null, Validators.maxLength(1)],
      cost: [null, [Validators.required, Validators.maxLength(5)]],
      registryNumber: [null],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.patchValue(this.allotment);
      this.form.controls['code'].disable();
      console.log(this.allotment.cost);
      if (this.allotment.cost === 'GASTO') {
        this.form.get('cost').setValue(this.allotment.cost);
      } else {
        this.form.get('cost').setValue(this.allotment.cost);
      }
      if (this.allotment.unaffordabilityCriterion === 'Y') {
        this.isChecked = true;
      } else {
        this.isChecked = false;
      }
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.form.get('cost').value === 'COSTO' ? 'COSTO' : 'GASTO';
    this.isChecked === true
      ? this.form.controls['unaffordabilityCriterion'].setValue('Y')
      : this.form.controls['unaffordabilityCriterion'].setValue('N');
    const id = this.form.get('code').value;
    console.log(this.form.getRawValue());
    this.serviceCatService.update(id, this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  create() {
    this.loading = true;
    this.form.get('cost').value === 'COSTO' ? 'COSTO' : 'GASTO';
    this.isChecked === true
      ? this.form.controls['unaffordabilityCriterion'].setValue('Y')
      : this.form.controls['unaffordabilityCriterion'].setValue('N');
    //console.log(this.form.getRawValue());
    this.serviceCatService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  close() {
    this.modalRef.hide();
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
