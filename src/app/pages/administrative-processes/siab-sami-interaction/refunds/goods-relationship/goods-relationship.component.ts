import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Provisional Data
//Components
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { AddGoodsComponent } from '../add-goods/add-goods.component';

@Component({
  selector: 'app-goods-relationship',
  templateUrl: './goods-relationship.component.html',
  styles: [],
})
export class GoodsRelationshipComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: { add: false, delete: true, edit: false },
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
      satExpedientNumber: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      saeExpedientNumber: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      satDocType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      processType: [null, [Validators.required]],
      amountRepay: [null, [Validators.required]],
    });
  }

  openModal(context?: Partial<AddGoodsComponent>): void {
    const modalRef = this.modalService.show(AddGoodsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.refresh.subscribe((data: any) => {
      if (data) this.data.load(data);
    });
  }

  delete(event: any) {
    this.alertQuestion('warning', 'Eliminar', 'Desea eliminar este bien?').then(
      question => {
        if (question.isConfirmed) {
          //Ejecutar el servicio
          this.data.remove(event.data);
          this.data.refresh();
        }
      }
    );
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
}
