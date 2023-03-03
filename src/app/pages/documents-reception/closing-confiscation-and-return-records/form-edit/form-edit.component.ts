import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, EMPTY, tap } from 'rxjs';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { IUpdateProceedings } from 'src/app/core/models/ms-proceedings/update-proceedings.model';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings/proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from './../../../../core/shared/patterns';

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
      proceedingsCve: [null, [Validators.required, Validators.maxLength(50)]],
      elaborationDate: [null, []],
      authorityOrder: [null, [Validators.required, Validators.maxLength(50)]],
      proceedingsType: [null],
      universalFolio: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(15),
        ],
      ],
      observations: [null, [Validators.required, Validators.maxLength(1000)]],
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
    console.log(this.proceeding);
    let dataToUpdate: any = {};
    console.log(this.proceeding);
    for (let key in this.proceeding) {
      if (key == 'transferNumber') {
        if (this.proceeding[key] != null) {
          console.log(1);
          dataToUpdate[key] = this.proceeding[key].id;
        } else {
          console.log(this.proceeding[key]);
          dataToUpdate[key] = this.proceeding[key];
        }
      } else {
        if (key == 'fileNumber') {
          dataToUpdate[key] = this.proceeding[key].filesId;
        } else {
          if (key == 'identifier') {
            dataToUpdate[key] = this.proceeding[key]?.code;
          } else {
            if (key != 'delegationNumber')
              dataToUpdate[key] = this.proceeding[key as keyof IProceedings];
          }
        }
      }
    }
    this.copyFormValues(dataToUpdate);
    this.proceedingsService
      .update(this.proceeding.id, dataToUpdate)
      .pipe(
        catchError(err => {
          this.onLoadToast('error', 'Error', err.message);
          return EMPTY;
        }),
        tap(data => console.log(data))
      )
      .subscribe({
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
          console.log(error);
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
