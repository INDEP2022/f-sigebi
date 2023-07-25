import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRegulatory } from 'src/app/core/models/catalogs/regulatory.model';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { RegulatoryService } from '../../../../core/services/catalogs/regulatory.service';
import { DefaultSelect } from '../../../../shared/components/select/default-select';

@Component({
  selector: 'app-regulatoy-form',
  templateUrl: './regulatoy-form.component.html',
  styles: [],
})
export class RegulatoyFormComponent extends BasePage implements OnInit {
  form: ModelForm<IRegulatory>;
  //form: FormGroup = new FormGroup({});
  title: string = 'Regulación';
  edit: boolean = false;
  regulatory: IRegulatory;
  racks = new DefaultSelect<IRegulatory>();
  fechaActual: string;
  idFraction: any;
  date: Date = new Date(); // Aquí puedes inicializarla con la fecha que desees mostrar
  dateFormat: string;
  creationDate: Date;
  fractionIdSelected = new DefaultSelect();
  fractionsId: string;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private regulatoryService: RegulatoryService,
    private datePipe: DatePipe,
    private fractionService: FractionService
  ) {
    super();
    const fecha = new Date();
    this.fechaActual = fecha.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null],
      fractionId: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      number: [
        null,
        [
          Validators.required,
          Validators.maxLength(25),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(600),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      validateEf: [
        null,
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      validateEc: [
        null,
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      version: [
        null,
        [Validators.maxLength(5), Validators.pattern(NUMBERS_PATTERN)],
      ],
      userCreation: [null],
      createDate: [null],
      userModification: [null],
      modificationDate: [null],
    });
    if (this.regulatory != null) {
      this.edit = true;
      this.form.patchValue(this.regulatory);
      // this.idFraction = this.regulatory.fractionId;
      // this.fractionsId = this.idFraction.id;
      // this.form.controls['fractionId'].setValue(this.fractionsId);
      console.log(this.regulatory.fractionId);
      //this.fractionsId = this.idFraction;
      this.getUpdateFractionAll(
        new ListParams(),
        this.regulatory.fractionId.toString()
      );
      //this.getFractionAll(new ListParams());
      //this.getFractionAll(new ListParams());
    }
    setTimeout(() => {
      this.getFractionAll(new ListParams());
    }, 1000);
  }

  getData(params: ListParams) {
    this.regulatoryService.getAll(params).subscribe(data => {
      this.racks = new DefaultSelect(data.data, data.count);
    });
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (this.form.controls['description'].value.trim() === '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    console.log('id', this.form.value.id_fraccion);

    this.regulatoryService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.regulatoryService
      .update(this.regulatory.id, this.form.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  getFractionAll(params: ListParams) {
    this.fractionService.getAll(params).subscribe({
      next: data => {
        this.fractionIdSelected = new DefaultSelect(data.data, data.count);
        console.log('consola 5', data.data);
      },
      error: error => {
        console.log(error);
        this.fractionIdSelected = new DefaultSelect();
      },
    });
  }

  getUpdateFractionAll(params: ListParams, id: string) {
    console.log(id);
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.fractionService.getAll(params).subscribe({
      next: data => {
        this.fractionIdSelected = new DefaultSelect(data.data, data.count);
        console.log('consola 5', data.data);
      },
      error: error => {
        console.log(error);
        this.fractionIdSelected = new DefaultSelect();
      },
    });
  }
}
