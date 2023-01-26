import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-add-lc-modal',
  templateUrl: './add-lc-modal.component.html',
  styles: [],
})
export class AddLcModalComponent extends BasePage implements OnInit {
  lcForm: FormGroup = new FormGroup({});
  title: string = 'Línea de Captura';
  edit: boolean = false;
  lc: any;
  layout: string;
  rfcItems = new DefaultSelect();
  clientItems = new DefaultSelect();
  @Output() refresh = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();

  rfcTestData: any[] = [
    {
      rfc: '146GTEN41OL',
    },
    {
      rfc: '246GTEN41OL',
    },
    {
      rfc: '346GTEN41OL',
    },
    {
      rfc: '446GTEN41OL',
    },
    {
      rfc: '546GTEN41OL',
    },
  ];

  clientsTestData: any[] = [
    {
      id: 1059,
    },
    {
      id: 2059,
    },
    {
      id: 3059,
    },
    {
      id: 4059,
    },
    {
      id: 5059,
    },
  ];

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getRfcs({ page: 1, text: '' });
    this.getClients({ page: 1, text: '' });
  }

  private prepareForm(): void {
    this.lcForm = this.fb.group({
      rfc: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
      batch: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      palette: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      checkNumber: [null, [Validators.required]],
      checkBank: [null, [Validators.required]],
      validityDate: [null, [Validators.required]],
      gsaeRef: [null, Validators.pattern(STRING_PATTERN)],
      gbankRef: [null, Validators.pattern(STRING_PATTERN)],
      status: [null],
      registerDate: [null],
      type: [null, [Validators.required]],
    });
    this.layout == 'RFC'
      ? this.lcForm.controls['clientId'].setValue('0')
      : this.lcForm.controls['rfc'].setValue('0');
    if (this.lc != null) {
      this.edit = true;
      this.lcForm.patchValue(this.lc);
      this.lc.typeCheck == true
        ? this.lcForm.controls['type'].setValue('CHECK')
        : this.lcForm.controls['type'].setValue('LINE');
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
    this.handleSuccess();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }

  handleSuccess() {
    // const message: string = this.edit ? 'Actualizado' : 'Guardado';
    // this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.edit
      ? this.onEdit.emit(this.lcForm.value)
      : this.onAdd.emit(this.lcForm.value);
    this.modalRef.hide();
  }

  getRfcs(params: ListParams) {
    if (params.text == '') {
      this.rfcItems = new DefaultSelect(this.rfcTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.rfcTestData.filter((i: any) => i.id == id)];
      this.rfcItems = new DefaultSelect(item[0], 1);
    }
  }

  getClients(params: ListParams) {
    if (params.text == '') {
      this.clientItems = new DefaultSelect(this.clientsTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.clientsTestData.filter((i: any) => i.id == id)];
      this.clientItems = new DefaultSelect(item[0], 1);
    }
  }
}
