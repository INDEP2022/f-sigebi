import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SeraLogService } from 'src/app/core/services/ms-audit/sera-log.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ClaimsFollowUpDetailComponent } from '../claims-follow-up-detail/claims-follow-up-detail.component';
import { CLAIMSFOLLOWUP_COLUMNS } from './claims-follow-up-columns';

@Component({
  selector: 'app-claims-follow-up',
  templateUrl: './claims-follow-up.component.html',
  styles: [],
})
export class ClaimsFollowUpComponent extends BasePage implements OnInit {
  claimsFollowUpForm: FormGroup;
  lawyers: any[] = [];
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  newSiniester: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private seraLogService: SeraLogService
  ) {
    super();
    this.settings.columns = CLAIMSFOLLOWUP_COLUMNS;
    this.settings.actions = true;
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.claimsFollowUpForm = this.fb.group({
      numberGood: [null, Validators.required],
      description: [null],
    });
  }
  add() {
    this.openForm();
  }
  validGood() {
    this.claimsFollowUpForm.controls['description'].setValue('');

    let data = {
      pGoodNumber: this.claimsFollowUpForm.controls['numberGood'].value,
      pOperation: 1,
    };
    this.seraLogService.postObtnGoodSinister(data).subscribe({
      next: data => {
        if (data) {
          this.claimsFollowUpForm.controls['description'].setValue(
            data.data[0].descripcion
          );
          this.newSiniester = true;
          this.queryClaims();
        } else {
          this.claimsFollowUpForm.controls['description'].setValue('');
          this.alert(
            'warning',
            'No se encontró el número de bien buscado.',
            ''
          );
        }
      },
      error: error => (this.loading = false),
    });
  }
  queryClaims() {
    this.loading = true;
    let data = {
      pGoodNumber: this.claimsFollowUpForm.controls['numberGood'].value,
      pOperation: 2,
    };
    this.seraLogService.postObtnGoodSinister(data).subscribe({
      next: data => {
        //INSERTAR DATA PARA TABLA
        console.log(data);
        this.lawyers = data.data;
        this.totalItems = data.count | 0;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  openForm(siniester?: any) {
    let good = {
      numberInGood: this.claimsFollowUpForm.controls['numberGood'].value,
      description: this.claimsFollowUpForm.controls['description'].value,
    };
    let config: ModalOptions = {
      initialState: {
        siniester,
        good,
        callback: (next: boolean) => {
          if (next) {
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ClaimsFollowUpDetailComponent, config);
  }
  edit(siniester: any) {
    this.openForm(siniester);
  }

  delete(bank: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
