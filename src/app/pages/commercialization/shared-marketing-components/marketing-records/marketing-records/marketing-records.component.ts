import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { AddDocsComponent } from '../add-docs/add-docs.component';
import { MarketingRecordsForm } from '../utils/marketing-records-form';
import { COLUMNS, COLUMNS2 } from './columns';
//Provisional Data
import { DocsData, GoodsData } from './data';

@Component({
  selector: 'app-marketing-records',
  templateUrl: './marketing-records.component.html',
  styles: [],
})
export class MarketingRecordsComponent extends BasePage implements OnInit {
  form = new FormGroup(new MarketingRecordsForm());
  formCcp: FormGroup = new FormGroup({});
  /**
   * Goods
   * */
  data: LocalDataSource = new LocalDataSource();
  goodsData: any[] = GoodsData;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  /**
   * Docs
   * */
  settings2;
  data2: LocalDataSource = new LocalDataSource();
  docsData: any[] = DocsData;
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  usersCcp: any = [];

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };

    this.settings2 = {
      ...this.settings,
      actions: { add: false, delete: true, edit: false },
      columns: COLUMNS2,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data.load(this.goodsData);
  }

  private prepareForm(): void {
    this.form.get('recordCommerType').valueChanges.subscribe(value => {
      if (value === 'good') {
        this.form.controls['goodId'].setValidators([Validators.required]);
        this.form.controls['goodId'].updateValueAndValidity();

        this.form.controls['portfolio'].clearValidators();
        this.form.controls['portfolio'].setValue(null);
        this.form.controls['portfolio'].updateValueAndValidity();
      } else {
        this.form.controls['portfolio'].setValidators([Validators.required]);
        this.form.controls['portfolio'].updateValueAndValidity();

        this.form.controls['goodId'].clearValidators();
        this.form.controls['goodId'].setValue(null);
        this.form.controls['goodId'].updateValueAndValidity();
      }
    });

    /***
     * Users CCopy
     * */
    this.formCcp = this.fb.group({
      userId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      scannerFolio: [null],
    });

    this.formCcp.valueChanges.subscribe(value => {
      let includeId = this.usersCcp.some(
        (us: any) => us.userId == value.userId
      );
      let includeName = this.usersCcp.some((us: any) => us.name == value.name);
      if (!includeId && !includeName && this.formCcp.valid) {
        this.usersCcp.push(value);
      }
    });
  }

  openModal(context?: Partial<AddDocsComponent>): void {
    const modalRef = this.modalService.show(AddDocsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.refresh.subscribe((data: any) => {
      if (data) this.data2.load(data);
    });
  }

  delete(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este documento?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.data2.remove(event.data);
        this.data2.refresh();
      }
    });
  }

  removeItem(index: number): void {
    this.usersCcp.splice(index, 1);
  }

  resetForm(): void {
    this.alertQuestion(
      'warning',
      'Borrar',
      'Desea borrar los datos ingresados?'
    ).then(question => {
      if (question.isConfirmed) {
        this.form.reset();
        this.formCcp.reset();
        /***
         * Users CCopy
         * */
        this.usersCcp = [];
        this.data2.load([]);
        this.data2.refresh();
      }
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  settingsChange2($event: any): void {
    this.settings2 = $event;
  }
}
