import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IRateCatalog } from 'src/app/core/models/catalogs/rate-catalog.model';
import { ParameterBaseCatService } from 'src/app/core/services/catalogs/rate-catalog.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  DOUBLE_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-modal-rates-catalog',
  templateUrl: './modal-rates-catalog.component.html',
  styles: [],
})
export class ModalRatesCatalogComponent extends BasePage implements OnInit {
  public override bsConfig: Partial<BsDatepickerConfig>;

  title: string = 'Tasa';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: IRateCatalog;
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
      keyRate: ['CETES', [Validators.required]],
      rate: [
        null,
        [
          Validators.required,
          Validators.pattern(DOUBLE_PATTERN),
          Validators.maxLength(20),
        ],
      ],
      year: [null, [Validators.required]],
      month: [null, [Validators.required]],
      coinType: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(15),
        ],
      ],
      closed: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      rateClosingDate: [null, [Validators.required]],
      userClosingRate: [null, [Validators.required]],
      registerNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
      this.form.controls['month'].disable();
      this.form.controls['year'].disable();
      this.form.controls['coinType'].disable();
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.form.controls['coinType'].value.trim() === '' ||
      this.form.controls['userClosingRate'].value.trim() === '' ||
      this.form.controls['closed'].value.trim() === '' ||
      (this.form.controls['coinType'].value.trim() == '' &&
        this.form.controls['userClosingRate'].value.trim() == '' &&
        this.form.controls['closed'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', '');
      return;
    } else {
      this.loading = true;
      let year = this.form.value.year;
      var date = new Date(year);
      year = date.getFullYear();
      //this.form.value.year = year;
      this.form.controls['year'].setValue(year);

      let month = this.form.value.month;
      var date = new Date(month);
      month = date.getMonth() + 1;
      //this.form.value.month = month;
      this.form.controls['month'].setValue(month);

      this.parameterCatService.newItem(this.form.getRawValue()).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  update() {
    if (
      this.form.controls['coinType'].value.trim() === '' ||
      this.form.controls['userClosingRate'].value.trim() === '' ||
      this.form.controls['closed'].value.trim() === '' ||
      (this.form.controls['coinType'].value.trim() == '' &&
        this.form.controls['userClosingRate'].value.trim() == '' &&
        this.form.controls['closed'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', '');
      return;
    } else {
      /*let year = this.form.value.year;
      var date = new Date(year);
      year = date.getFullYear();
      //this.form.value.year = year;
      this.form.controls['year'].setValue(String(year));

      let month = this.form.value.month;
      var date = new Date(month);
      month = date.getMonth() + 1;
      //this.form.value.month = month;
      this.form.controls['month'].setValue(String(month));
      this.form.controls['year'].setValue(String(year))*/

      this.loading = true;
      this.parameterCatService.update(this.form.getRawValue()).subscribe({
        next: data => {
          //this.modalRef.hide();
          this.handleSuccess();
        },
        error: error => (this.loading = false),
      });
    }
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
