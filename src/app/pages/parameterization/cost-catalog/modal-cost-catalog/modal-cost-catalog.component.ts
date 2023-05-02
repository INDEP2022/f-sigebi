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
  title: string = 'Catalogo de Costos';
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
      keyServices: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      descriptionServices: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeExpenditure: [null, [Validators.required]],
      unaffordable: [null],
      cost: [null, [Validators.required]],
      expenditure: [null],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
      if (this.allotment.cost) {
        this.form.get('cost').setValue('cost');
      }
      if (this.allotment.expenditure) {
        this.form.get('cost').setValue('expenditure');
      }
    }
  }

  putCatalog() {
    this.loading = true;
    const body = {
      cost: this.form.get('cost').value === 'cost' ? 'COSTO' : 'GASTO',
      description: this.form.get('descriptionServices').value,
      code: this.form.get('keyServices').value,
      subaccount: this.form.get('typeExpenditure').value,
      unaffordabilityCriterion: this.form.get('unaffordable').value ? 'Y' : 'N',
      // registryNumber: this.form.get('keyServices').value,
    };
    this.catalogService.putCostCatalog(body.code, body).subscribe({
      next: (resp: any) => {
        if (resp) {
          this.handleSuccess();
        }
      },
    });
  }

  postCatalog() {
    this.loading = true;
    const body = {
      cost: this.form.get('cost').value === 'cost' ? 'COSTO' : 'GASTO',
      description: this.form.get('descriptionServices').value,
      code: this.form.get('keyServices').value,
      subaccount: this.form.get('typeExpenditure').value,
      unaffordabilityCriterion: this.form.get('unaffordable').value ? 'Y' : 'N',
      registryNumber: this.form.get('keyServices').value,
    };
    this.catalogService.postCostCatalog(body).subscribe({
      next: (resp: any) => {
        if (resp) {
          this.loading = false;
          this.handleSuccess();
        }
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
  handleSuccess() {
    this.loading = false;
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
