import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { CCBmfCBankMovementsFormComponent } from '../bank-movements-form/c-c-bmf-c-bank-movements-form.component';
//Provisional Data
import { data, dataBA } from './data';

@Component({
  selector: 'app-c-c-bmt-c-bank-movements-types',
  templateUrl: './c-c-bmt-c-bank-movements-types.component.html',
  styles: [],
})
export class CCBmtCBankMovementsTypesComponent
  extends BasePage
  implements OnInit
{
  //PROVISIONAL Bank Account DATA
  bankAccounts: any[] = dataBA;

  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  banksMovD = data;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  selectedRow: any = null;

  //Columns
  columns = COLUMNS;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: { ...this.settings.actions, add: false, edit: true, delete: true },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.data.load(this.banksMovD);
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      bank: [null, [Validators.required]],
    });
  }

  openModal(context?: Partial<CCBmfCBankMovementsFormComponent>) {
    const modalRef = this.modalService.show(CCBmfCBankMovementsFormComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) console.log(next)//this.getCities();
    });
  }

  add() {
    this.openModal();
  }

  openForm(bankMove: any) {
    this.openModal({ edit:true, bankMove });
  }

  delete(bankMove: any) {
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
