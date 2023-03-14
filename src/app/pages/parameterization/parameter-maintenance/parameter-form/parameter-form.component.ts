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
      initialValue: [null, [Validators.required, Validators.maxLength(200)]],
      finalValue: [null, Validators.maxLength(200)],
      startDate: [null, Validators.required],
      endDate: [null],
    });

    this.form.get('startDate').valueChanges.subscribe({
      next: () => this.validateDate(),
    });

    this.form.get('endDate').valueChanges.subscribe({
      next: () => this.validateDate(),
    });

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
        this.form.get('id').enable();
        this.parameterServ
          .update(this.form.get('id').value, this.form.value)
          .subscribe({
            next: () => this.handleSuccess(),
            error: err => {
              this.loading = false;
              this.onLoadToast('error', err.error.message, '');
            },
          });
      } else {
        this.parameterServ.create(this.form.value).subscribe({
          next: () => this.handleSuccess(),
          error: err => {
            this.loading = false;
            this.onLoadToast('error', err.error.message, '');
          },
        });
      }
    }
  }

  handleSuccess() {
    this.onLoadToast(
      'success',
      'Parámetro',
      `Ha sido ${this.edit ? 'actualizado' : 'creado'} correctamente`
    );
    this.loading = false;
    this.modalService.content.callback(true);
    this.modalService.hide();
  }

  close() {
    this.modalService.hide();
  }
}
