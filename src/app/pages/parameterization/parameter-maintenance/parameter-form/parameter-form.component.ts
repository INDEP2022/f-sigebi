import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IParametersV2 } from 'src/app/core/models/ms-parametergood/parameters.model';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

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
  parameter: IParametersV2;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalRef,
    private datePipe: DatePipe,
    private parameterServ: ParameterCatService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      cve: [
        null,
        [
          Validators.required,
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.maxLength(10),
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
      initialValue: [null, [Validators.required, Validators.maxLength(100)]],
      finalValue: [null, Validators.maxLength(30)],
      startDate: [null],
      endDate: [null],
    });

    if (this.parameter?.startDate != null) {
      this.parameter.startDate = new Date(
        this.parameter.startDate.toString().split('-').join('/')
      );
      //this.datePipe.transform(this.parameter.startDate, 'dd/MM/yyyy', '+0430') as any //'30/12/2014'
    }
    if (this.parameter?.endDate != null) {
      this.parameter.endDate = new Date(
        this.parameter.endDate.toString().split('-').join('/')
      );
      //this.datePipe.transform(this.parameter.endDate, 'dd/MM/yyyy', '+0430') as any //'30/12/2014'
    }
    this.form.patchValue(this.parameter);
  }

  confirm() {
    if (this.form.valid) {
      if (this.edit) {
        this.parameterServ
          .update(this.form.get('cve').value, this.form.value)
          .subscribe({
            next: () => this.handleSuccess(),
            error: err => this.onLoadToast('error', err.error.message, ''),
          });
      } else {
        this.parameterServ.create(this.form.value).subscribe({
          next: () => this.handleSuccess(),
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    }
  }

  convertDate() {
    this.datePipe.transform(
      this.parameter.startDate,
      'dd/MM/yyyy',
      '+0430'
    ) as any;
  }

  handleSuccess() {
    this.onLoadToast(
      'success',
      'Parámetro',
      `Ha sido ${this.edit ? 'actualizado' : 'creado'} correctamente`
    );
    this.modalService.content.callback(true);
    this.modalService.hide();
  }

  close() {
    this.modalService.hide();
  }
}
