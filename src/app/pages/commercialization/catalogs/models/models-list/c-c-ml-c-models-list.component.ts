import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { CCMfCModelsFormComponent } from '../models-form/c-c-mf-c-models-form.component';
//Provisional Data
import { DATA } from './data';

@Component({
  selector: 'app-c-c-ml-c-models-list',
  templateUrl: './c-c-ml-c-models-list.component.html',
  styles: [
  ]
})
export class CCMlCModelsListComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  dataBrands = DATA;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  selectedRow: any = null;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: { add: false, edit: true, delete: true },
      columns: COLUMNS,
    };

  }

  ngOnInit(): void {
    this.data.load(this.dataBrands);
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      brand: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  openModal(context?: Partial<CCMfCModelsFormComponent>) {
    const modalRef = this.modalService.show(CCMfCModelsFormComponent, {
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

  openForm(model: any) {
    this.openModal({ edit:true, model });
  }

  delete(vault: any) {
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
