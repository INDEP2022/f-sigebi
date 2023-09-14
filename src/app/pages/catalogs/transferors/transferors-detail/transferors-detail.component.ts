import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferentesSaeService } from 'src/app/core/services/catalogs/transferentes-sae.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-transferors-detail',
  templateUrl: './transferors-detail.component.html',
  styles: [],
})
export class TransferorsDetailComponent extends BasePage implements OnInit {
  title: string = 'Estado por transferente';
  edit: boolean = false;

  transferorsStateForm: ModelForm<ITransferente>;

  transferorsState: ITransferente;

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
    this.transferorsStateForm = this.fb.group({
      id: [null, []],
      nameTransferent: [null, []],
      keyTransferent: [null, []],
      userCreation: [null, []],
      dateCreation: [null, []],
      userUpdate: [null, []],
      dateUpdate: [null, []],
      typeTransferent: [null, []],
      version: [null, []],
      status: [null, []],
      type: [null, []],
      dateBegOperation: [null, []],
      dateFinalOperation: [null, []],
      assignor: [null, []],
      objectCharge: [null, []],
      sector: [null, []],
      formalization: [null, []],
      dateFormalization: [null, []],
      name: [null, []],
      entity: [null, []],
      amedingAgree: [null, []],
      dateAmeding: [null, []],
      typeGoods: [null, []],
      custodyGuardGoods: [null, []],
      destinyGoods: [null, []],
      daysAdminGoods: [null, []],
      cvman: [null, []],
      indcap: [null, []],
      active: [null, []],
      risk: [null, []],
      nameAndId: [null, []],
      idTransferee: [null, []],
      stateKey: [null, []],
      nameTransferee: [null, []],
      //version: [null],
    });
    if (this.transferorsState != null) {
      this.edit = true;
      this.transferorsStateForm.patchValue(this.transferorsState);
    }
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
      .createStateForTransferent(this.transferorsStateForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.transferentesSaeService
      .updateStateForTransferent(this.transferorsStateForm.getRawValue())
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
