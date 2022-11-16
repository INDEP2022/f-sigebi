import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS, COLUMNS2 } from './columns';
//Components
import { CCBsbfCBrandsSubBrandsFormComponent } from '../brands-sub-brands-form/c-c-bsbf-c-brands-sub-brands-form.component';
//Provisional Data
import { DATA } from './data';

@Component({
  selector: 'app-c-c-bsbl-c-brands-sub-brands-list',
  templateUrl: './c-c-bsbl-c-brands-sub-brands-list.component.html',
  styles: [],
})
export class CCBsblCBrandsSubBrandsListComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  dataBrands = DATA;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  data2: LocalDataSource = new LocalDataSource();
  //dataSubBrands: any = [];
  settings2;
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  rowBrand: string = null;
  selectedRow: any = null;

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: { ...this.settings.actions, add: false, edit: true, delete: true },
      columns: COLUMNS,
    };

    this.settings2 = {
      ...this.settings,
      actions: false,
      columns: COLUMNS2,
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

  openModal(context?: Partial<CCBsbfCBrandsSubBrandsFormComponent>) {
    const modalRef = this.modalService.show(
      CCBsbfCBrandsSubBrandsFormComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) console.log(next); //this.getCities();
    });
  }

  add() {
    this.openModal();
  }

  openForm(brand: any) {
    this.openModal({ edit: true, brand });
  }

  delete(brand: any) {
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

  selectRow(row: any) {
    this.data2.load(row.subbrands);
    this.data2.refresh();
    this.rowBrand=row.brand;
    this.rowSelected = true;
  }
}
