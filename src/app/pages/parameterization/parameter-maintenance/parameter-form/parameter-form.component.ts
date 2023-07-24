import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IParameters } from 'src/app/core/models/ms-parametergood/parameters.model';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-parameter-form',
  templateUrl: './parameter-form.component.html',
  styles: [],
})
export class ParameterFormComponent extends BasePage implements OnInit {
  @Output() formEmiter: any = new EventEmitter<any>();
  form: FormGroup = new FormGroup({});
  title: string = 'Parámetro';
  edit: boolean = false;
  parameter: IParameters = {} as IParameters;
  minDate = new Date('1999/01/01');
  invalidDate: boolean = false;
  minDate1: Date;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalRef,
    private parameterServ: ParameterCatService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(20),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(60),
        ],
      ],
      initialValue: [
        null,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      finalValue: [
        null,
        [Validators.maxLength(200), Validators.pattern(STRING_PATTERN)],
      ],
      startDate: [null, Validators.required],
      endDate: [null],
    });

    /*this.form.get('startDate').valueChanges.subscribe({
      next: () => this.validateDate(),
    });

    this.form.get('endDate').valueChanges.subscribe({
      next: () => this.validateDate(),
    });*/

    this.form.patchValue(this.parameter);
    if (this.edit) this.form.get('id').disable();
  }

  validateDate() {
    const dateInit = this.form.get('startDate').value;
    const dateEnd = this.form.get('endDate').value;

    if (!dateEnd || dateEnd == 'Invalid Date') return;

    const date1 =
      typeof dateInit == 'string'
        ? this.dateTimeTypeString(dateInit)
        : this.dateTimeTypeDate(dateInit);
    const date2 =
      typeof dateEnd == 'string'
        ? this.dateTimeTypeString(dateEnd)
        : this.dateTimeTypeDate(dateEnd);

    if (date2 < date1) {
      this.invalidDate = true;
      this.onLoadToast(
        'error',
        'La fecha final debe ser mayor a la de inicio',
        ''
      );
    } else {
      this.invalidDate = false;
    }
  }

  validateDate1(event: Date) {
    this.minDate1 = event;
  }

  dateTimeTypeString(date: string): number {
    let time: string = date.split('T')[0].split('-').join('/');
    return new Date(time).getTime();
  }

  dateTimeTypeDate(date: Date): number {
    let time: string = this.datePipe.transform(date, 'yyyy/MM/dd');
    return new Date(time).getTime();
  }

  confirm() {
    this.loading = true;
    if (this.form.valid) {
      if (this.edit) {
        if (
          this.form.controls['id'].value.trim() == '' ||
          this.form.controls['description'].value.trim() == '' ||
          this.form.controls['initialValue'].value.trim() == '' ||
          (this.form.controls['id'].value.trim() == '' &&
            this.form.controls['description'].value.trim() == '' &&
            this.form.controls['initialValue'].value.trim() == '')
        ) {
          this.alert('warning', 'No se puede guardar campos vacíos', ``);
          this.loading = false;
          return;
        } else {
          this.form.get('id').enable();
          this.parameterServ
            .update(this.form.get('id').value, this.form.getRawValue())
            .subscribe({
              next: () => this.handleSuccess(),
              error: err => {
                this.loading = false;
                this.onLoadToast('error', err.error.message, '');
              },
            });
        }
      } else {
        if (
          this.form.controls['id'].value.trim() == '' ||
          this.form.controls['description'].value.trim() == '' ||
          this.form.controls['initialValue'].value.trim() == '' ||
          (this.form.controls['id'].value.trim() == '' &&
            this.form.controls['description'].value.trim() == '' &&
            this.form.controls['initialValue'].value.trim() == '')
        ) {
          this.alert('warning', 'No se puede actualizar campos vacíos', ``);
          this.loading = false;
          return;
        } else {
          this.parameterServ.create(this.form.getRawValue()).subscribe({
            next: () => this.handleSuccess(),
            error: err => {
              this.loading = false;
              this.onLoadToast('error', err.error.message, '');
            },
          });
        }
      }
    }
  }

  handleSuccess() {
    /*this.onLoadToast(
      'success',
      'Parámetro',
      `Ha sido ${this.edit ? 'actualizado' : 'creado'} correctamente`
    );*/
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalService.content.callback(true);
    this.modalService.hide();
  }

  close() {
    this.modalService.hide();
  }
}
