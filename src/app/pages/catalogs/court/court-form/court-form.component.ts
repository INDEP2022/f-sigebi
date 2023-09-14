import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ICourt } from '../../../../core/models/catalogs/court.model';
import { CourtService } from './../../../../core/services/catalogs/court.service';

@Component({
  selector: 'app-court-form',
  templateUrl: './court-form.component.html',
  styles: [],
})
export class CourtFormComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  courtForm: FormGroup = new FormGroup({});
  title: string = 'Juzgado';
  edit: boolean = false;
  court: ICourt;
  code: number = 321;
  items = new DefaultSelect<ICourt>();
  @Output() refresh = new EventEmitter<true>();
  circuit = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private courtService: CourtService,
    private dinamic: DynamicTablesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.courtForm = this.fb.group({
      description: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      manager: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      numRegister: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      numPhone: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(20)],
      ],
      cologne: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      street: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      numInside: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      numExterior: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
      delegationMun: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      zipCode: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      circuitCVE: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(15),
        ],
      ],
    });
    if (this.court != null) {
      this.edit = true;
      console.log(this.court);
      this.courtForm.patchValue(this.court);
    }
    this.getCircuit(new ListParams());
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (this.courtForm.controls['description'].value.trim() == '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.courtService.create(this.courtForm.getRawValue()).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  update() {
    if (this.courtForm.controls['description'].value.trim() == '') {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.courtService
        .update(this.court.id, this.courtForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  getCircuit(params?: ListParams) {
    this.dinamic.getTvalTable1ByTableKey(this.code, params).subscribe({
      next: response => {
        this.circuit = new DefaultSelect(response.data, response.count);
      },
      error: err => {
        this.onLoadToast('error', err.error.message, '');
        this.circuit = new DefaultSelect();
      },
    });
  }
}
