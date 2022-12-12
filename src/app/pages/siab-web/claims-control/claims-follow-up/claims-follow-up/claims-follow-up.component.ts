import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
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
    });
  }
  add() {
    this.openModal();
  }

  openModal(context?: Partial<any>) {
    const modalRef = this.modalService.show(ClaimsFollowUpDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe((next: any) => {
      if (next) {
      }
    });
  }
  edit(bank: any) {
    this.openModal({ edit: true, bank });
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
