import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-witness-form',
  templateUrl: './witness-form.component.html',
  styles: [],
})
export class WitnessFormComponent extends BasePage implements OnInit {
  witnessForm: FormGroup = new FormGroup({});
  proceeding: IProceedings;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private receptionGoodService: ReceptionGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.witnessForm = this.fb.group({
      receiptId: [this.proceeding.id],
      actId: [this.proceeding.actId],
      programmingId: [this.proceeding.programmingId],
      nameWitness: [null, [Validators.pattern(STRING_PATTERN)]],
      chargeWitness: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignature: [null],
      creationUser: ['ost13335'],
      creationDate: ['2023-06-12'],
      modificationUser: ['ost13335'],
      modificationDate: ['2023-06-12'],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea crear un nuevo testigo?'
    ).then(question => {
      if (question.isConfirmed) {
        if (this.witnessForm.get('electronicSignature').value == true) {
          this.witnessForm.get('electronicSignature').setValue('S');
        } else {
          this.witnessForm.get('electronicSignature').setValue('N');
        }
        this.receptionGoodService
          .createReceiptWitness(this.witnessForm.value)
          .subscribe({
            next: response => {
              this.alertInfo(
                'success',
                'Registro Guardado',
                'Testigo creado correctamente'
              ).then(question => {
                if (question.isConfirmed) {
                  this.modalRef.content.callback(true);
                  this.close();
                }
              });
            },
            error: error => {},
          });
      }
    });
  }
}
