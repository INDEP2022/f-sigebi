import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRegulatory } from 'src/app/core/models/catalogs/regulatory.model';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { RegulatoryService } from '../../../../core/services/catalogs/regulatory.service';
import { DefaultSelect } from '../../../../shared/components/select/default-select';

@Component({
  selector: 'app-regulatoy-form',
  templateUrl: './regulatoy-form.component.html',
  styles: [],
})
export class RegulatoyFormComponent extends BasePage implements OnInit {
  //form: ModelForm<IRegulatory>;
  form: FormGroup = new FormGroup({});
  title: string = 'Regulacion';
  edit: boolean = false;
  regulatory: IRegulatory;
  racks = new DefaultSelect<IRegulatory>();
  fechaActual: string;
  idFraction: any;
  date: Date = new Date(); // Aquí puedes inicializarla con la fecha que desees mostrar
  dateFormat: string;
  creationDate: Date;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private regulatoryService: RegulatoryService,
    private datePipe: DatePipe
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
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      number: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      validateEf: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      validateEc: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      userCreation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      createDate: [null],
      userModification: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      modificationDate: [null],
      version: [null, [Validators.required]],
    });
    if (this.regulatory != null) {
      this.edit = true;
      this.idFraction = this.regulatory.fractionId;
      this.creationDate = this.regulatory.creationDate;
      this.dateFormat = this.datePipe.transform(
        this.creationDate,
        'dd/MM/yyyy'
      );
      console.log(this.dateFormat);
      console.log(this.regulatory);
      this.form.patchValue(this.regulatory);
      this.form.controls['fractionId'].setValue(this.idFraction.id);
      this.form.controls['createDate'].setValue(this.dateFormat);
    }
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
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
