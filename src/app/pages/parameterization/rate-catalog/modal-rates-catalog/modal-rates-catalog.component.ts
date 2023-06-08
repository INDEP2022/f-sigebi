import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ParameterBaseCatService } from 'src/app/core/services/catalogs/rate-catalog.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-modal-rates-catalog',
  templateUrl: './modal-rates-catalog.component.html',
  styles: [],
})
export class ModalRatesCatalogComponent extends BasePage implements OnInit {
  public override bsConfig: Partial<BsDatepickerConfig>;

  title: string = 'TASA';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private parameterCatService: ParameterBaseCatService
  ) {
    super();
    this.bsConfig = Object.assign(
      {},
      {
        dateInputFormat: 'YYYY',
        minMode: 'year' as BsDatepickerViewMode,
      }
    );
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      keyRate: [null, [Validators.required]],
      rate: [null, [Validators.required]],
      year: [null, [Validators.required]],
      month: [null, [Validators.required]],
      coinType: [null, [Validators.required]],
      closed: [null, [Validators.required]],
      rateClosingDate: [null, [Validators.required]],
      userClosingRate: [null, [Validators.required]],
      registerNumber: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  confirm() {
    /*this.edit ? this.update() : */
    this.create();
  }

  create() {
    this.loading = true;
    let year = this.form.value.year;
    var date = new Date(year);
    year = date.getFullYear();
    this.form.value.year = year;

    let month = this.form.value.month;
    var date = new Date(month);
    month = date.getMonth() + 1;
    this.form.value.month = month;

    this.parameterCatService.newItem(this.form.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });

    this.close();
  }

  /*update() {
    this.loading = true;
    this.parameterCatService
      .update(this.form.id, this.form.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }*/
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
