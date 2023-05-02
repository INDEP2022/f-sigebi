import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-assigned-goods-modal',
  templateUrl: './assigned-goods-modal.component.html',
  styles: [],
})
export class AssignedGoodsModalComponent extends BasePage implements OnInit {
  title: string = 'Bien Asignado';
  good: any;
  positions: number[] = [];
  edit: boolean = false;
  goodClassification: any[] = [];
  siabClassification: any[] = [];
  goodItems = new DefaultSelect();
  goodForm: FormGroup = new FormGroup({});
  @Output() onConfirm = new EventEmitter<any>();

  goodTestData = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
  ];

  goodClassificationData = [
    {
      description: 'CLASIFICACION 1',
    },
    {
      description: 'CLASIFICACION 2',
    },
    {
      description: 'CLASIFICACION 3',
    },
    {
      description: 'CLASIFICACION 4',
    },
    {
      description: 'CLASIFICACION 5',
    },
  ];

  siabClassificationData = [
    {
      description: 'CLASIFICACION 1',
    },
    {
      description: 'CLASIFICACION 2',
    },
    {
      description: 'CLASIFICACION 3',
    },
    {
      description: 'CLASIFICACION 4',
    },
    {
      description: 'CLASIFICACION 5',
    },
  ];

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGoods({ page: 1, text: '' });
    this.getGoodClassification();
    this.getSiabClassification();
  }

  private prepareForm(): void {
    this.goodForm = this.fb.group({
      goodId: [null, [Validators.required]],
      appraisal: [null, Validators.pattern(STRING_PATTERN)],
      appraisalDate: [null],
      sessionNumber: [null],
      goodClasification: [null],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      location: [null, Validators.pattern(STRING_PATTERN)],
      mandate: [null, Validators.pattern(STRING_PATTERN)],
      siabClassification: [null],
      commentary: [null, Validators.pattern(STRING_PATTERN)],
    });
    if (this.good !== undefined) {
      this.edit = true;
      this.goodForm.patchValue(this.good);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para agregar control
    this.loading = false;
    this.onConfirm.emit(this.goodForm.value);
    this.modalRef.hide();
  }

  getGoodClassification() {
    this.goodClassification = this.goodClassificationData;
  }

  getSiabClassification() {
    this.siabClassification = this.siabClassificationData;
  }

  getGoods(params: ListParams) {
    if (params.text == '') {
      this.goodItems = new DefaultSelect(this.goodTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.goodTestData.filter((i: any) => i.id == id)];
      this.goodItems = new DefaultSelect(item[0], 1);
    }
  }
}
