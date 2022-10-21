import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';
import { LocalDataSource } from 'ng2-smart-table';
//Provisional Data
import { goodsData } from './data';
//Components
import { PaAgCAddGoodsComponent } from '../add-goods/pa-ag-c-add-goods.component';

@Component({
  selector: 'app-pa-gr-c-goods-relationship',
  templateUrl: './pa-gr-c-goods-relationship.component.html',
  styles: [
  ]
})
export class PaGrCGoodsRelationshipComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: { add: false, delete: true, edit: false},
      selectMode: 'multi',
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      recordDate: [null, [Validators.required]],
      procedureNumber: [null, [Validators.required]],
      status: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      satDocNumber: [null, [Validators.required]],
      satExpedientNumber: [null, [Validators.required]],
      saeExpedientNumber: [null, [Validators.required]],
      satDocType: [null, [Validators.required]],
      processType: [null, [Validators.required]],
      amountRepay: [null, [Validators.required]],
    });
  }

  openModal(context?: Partial<PaAgCAddGoodsComponent>): void {

    const modalRef = this.modalService.show(PaAgCAddGoodsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.refresh.subscribe((data:any) => {
      if (data)
        this.data.load(data);
    });  
  }

  delete(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este bien?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.data.remove(event);
        this.data.refresh();
      }
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

}
