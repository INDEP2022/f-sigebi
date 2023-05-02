import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  IState,
  IStateByTransferent,
} from 'src/app/core/models/catalogs/state-model';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferentesSaeService } from 'src/app/core/services/catalogs/transferentes-sae.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-state-modal',
  templateUrl: './state-modal.component.html',
  styles: [],
})
export class StateModalComponent extends BasePage implements OnInit {
  title: string = 'Estado por transferente';
  edit: boolean = false;

  stateForm: ModelForm<IStateByTransferent>;
  stateByTransferent: IStateByTransferent;

  idTrans: ITransferente;
  id: IState;

  states = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private stateOfRepublicService: StateOfRepublicService,
    private transferentesSaeService: TransferentesSaeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.stateForm = this.fb.group({
      idTransferee: [null, []],
      stateKey: [null, []],
      nameTransferee: [null, []],
    });
    if (this.stateByTransferent != null) {
      this.edit = true;
      this.id = this.stateByTransferent.state as IState;
      this.stateForm.patchValue(this.stateByTransferent);
      this.stateForm.controls['idTransferee'].setValue(
        this.idTrans.nameTransferent
      );
      this.stateForm.controls['stateKey'].setValue(this.id.id);
    } else {
      this.edit = false;
      this.stateForm.controls['nameTransferee'].setValue(
        this.idTrans.nameTransferent
      );
      this.stateForm.controls['idTransferee'].setValue(this.idTrans.id);
    }
  }

  getStates(params: ListParams) {
    this.stateOfRepublicService.getAll(params).subscribe({
      next: data => (this.states = new DefaultSelect(data.data, data.count)),
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
    this.transferentesSaeService
      .createStateForTransferent(this.stateForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.transferentesSaeService
      .updateStateForTransferent(this.stateForm.value)
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
