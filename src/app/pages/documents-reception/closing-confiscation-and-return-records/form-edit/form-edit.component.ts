import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { IUpdateProceedings } from 'src/app/core/models/ms-proceedings/update-proceedings.model';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings/proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'form-edit',
  templateUrl: './form-edit.component.html',
  styles: [],
})
export class FormEditComponent extends BasePage implements OnInit {
  form: FormGroup;
  dataForm: any = {};
  title: string;
  proceeding: IProceedings;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private proceedingsService: ProceedingsService
  ) {
    super();
  }

  ngOnInit() {
    console.log(this.proceeding);
    this.initForm();
    this.setForm(this.proceeding);
  }

  initForm() {
    this.form = this.fb.group({
      id: [null, []],
      proceedingsCve: [null, [Validators.required]],
      elaborationDate: [null, []],
      authorityOrder: [
        null,
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.required],
      ],
      proceedingsType: [null],
      universalFolio: [null, [Validators.required]],
      observations: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
    });
  }

  setForm(proceeding: IProceedings) {
    this.dataForm = {
      id: proceeding.id,
      proceedingsCve: proceeding.proceedingsCve,
      elaborationDate: this.convertDate(proceeding.elaborationDate),
      authorityOrder: proceeding.authorityOrder,
      proceedingsType: proceeding.proceedingsType,
      universalFolio: proceeding.universalFolio,
      observations: proceeding.observations,
    };
    this.form.patchValue(this.dataForm);
  }

  convertDate(date: Date) {
    return new Date(date).toLocaleDateString().toString();
  }

  confirm() {}

  close() {
    this.modalRef.hide();
  }

  buildObjectToUpdate() {
    let dataToUpdate: any = {};
    for (let key in this.proceeding) {
      if (key == 'transferNumber') {
        dataToUpdate[key] = this.proceeding[key].id;
      } else {
        if (key == 'fileNumber') {
          dataToUpdate[key] = this.proceeding[key].filesId;
        } else {
          if (key == 'identifier') {
            dataToUpdate[key] = this.proceeding[key].code;
          } else {
            if (key != 'delegationNumber')
              dataToUpdate[key] = this.proceeding[key as keyof IProceedings];
          }
        }
      }
    }
    this.copyFormValues(dataToUpdate);
    this.proceedingsService.update(this.proceeding.id, dataToUpdate).subscribe({
      next: (resp: IListResponse<IProceedings>) => {
        this.onLoadToast(
          'success',
          'Actualizada',
          'El acta ha sido actualizado exitosamente'
        );
        this.modalRef.content.callback(true);
        this.modalRef.hide();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status <= 404) {
          this.form.patchValue(this.dataForm);
          this.onLoadToast('error', 'Error', error.message);
        }
      },
    });
  }

  copyFormValues(dataToUpdate: IUpdateProceedings) {
    dataToUpdate.proceedingsCve = this.form.value.proceedingsCve;
    dataToUpdate.observations = this.form.value.observations;
    dataToUpdate.authorityOrder = this.form.value.authorityOrder;
    dataToUpdate.universalFolio = this.form.value.universalFolio;
  }
}
