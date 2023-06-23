import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
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
  title: string = 'Costo';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private catalogService: CostCatalogService
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
      unaffordabilityCriterion: [null, [Validators.maxLength(1)]],
      cost: [null, [Validators.maxLength(5)]],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.patchValue(this.allotment);
      this.form.controls['code'].disable();
    }
  }

  putCatalog() {
    this.loading = true;
    const code = this.form.get('code').value;
    const body = {
      cost: this.form.get('cost').value,
      description: this.form.get('description').value,
      subaccount: this.form.get('subaccount').value,
      unaffordabilityCriterion: this.form.get('unaffordabilityCriterion').value ? 'Y' : 'N',
    };
    this.catalogService.putCostCatalog(code, body).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  postCatalog() {
    this.loading = true;
    const body = {
      cost: this.form.get('cost').value,
      description: this.form.get('description').value,
      code: this.form.get('code').value,
      subaccount: this.form.get('subaccount').value,
      unaffordabilityCriterion: this.form.get('unaffordabilityCriterion').value ? 'Y' : 'N',
    };
    this.catalogService.postCostCatalog(body).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  close() {
    this.modalRef.hide();
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
