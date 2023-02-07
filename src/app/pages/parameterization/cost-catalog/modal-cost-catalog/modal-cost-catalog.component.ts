import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
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
export class ModalCostCatalogComponent implements OnInit {
  title: string = 'Catalogo de Costos';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private catalogService: CostCatalogService
  ) {}

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
      unaffordable: [null, [Validators.required]],
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
    const body = {
      cost: this.form.get('cost').value === 'cost' ? 'COSTO' : 'GASTO',
      description: this.form.get('descriptionServices').value,
      code: this.form.get('keyServices').value,
      subaccount: this.form.get('typeExpenditure').value,
      unaffordabilityCriterion: this.form.get('unaffordable').value ? 'Y' : 'N',
      registryNumber: this.form.get('keyServices').value,
    };
    this.catalogService.putCostCatalog(body.code, body).subscribe({
      next: (resp: any) => {
        if (resp) {
          this.refresh.emit(true);
          this.close();
        }
      },
    });
  }

  postCatalog() {
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
          this.refresh.emit(true);
          this.close();
        }
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
