import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICatMotiveRev } from 'src/app/core/models/catalogs/cat-motive-rev';
import { CatMotiveRevService } from 'src/app/core/services/catalogs/cat-motive-rev.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ReasonsModelComponent } from '../reasons-model/reasons-model.component';
import {
  goodCheck,
  GROUNDSSTATUSMODAL_COLUMNS,
} from './grounds-status-modal-columns';

@Component({
  selector: 'app-grounds-status-modal',
  templateUrl: './grounds-status-modal.component.html',
  styles: [
    `
      input[type='file']::file-selector-button {
        margin-right: 20px;
        border: none;
        background: #9d2449;
        padding: 10px 20px;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        /* transition: background.2s ease-in-out; */
      }
    `,
  ],
})
export class GroundsStatusModalComponent extends BasePage implements OnInit {
  form: FormGroup;

  valuesList: ICatMotiveRev[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  ESTATUS: string;
  ID_EVENTO: string;
  P_DIRECCION: string;
  fileName: string;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private catMotiveRevService: CatMotiveRevService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: GROUNDSSTATUSMODAL_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.ESTATUS != null) {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getMinPubAll(this.ESTATUS, this.P_DIRECCION));
      this.pupWhereMotivos();
    } else {
      this.alert('warning', 'El estatus es nulo', '');
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null, [Validators.required]],
      fileCSV: [null, [Validators.required]],
      whereMot: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      reasons: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  getMinPubAll(initialStatus: string, goodType: string) {
    this.loading = true;
    this.params.getValue()['filter.initialStatus'] = initialStatus;
    this.params.getValue()['filter.goodType'] = goodType;
    this.catMotiveRevService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.valuesList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  openModal2(): void {
    const modalRef = this.modalService.show(ReasonsModelComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
  chargeFile(event: any) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    this.fileName = files[0].name;
    this.form.controls['file'].setValue(this.fileName);
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    // fileReader.onload = () => this.readExcel(fileReader.result);
  }
  pupWhereMotivos() {
    if (this.ESTATUS != null) {
      this.form.controls['whereMot'].setValue(
        'Estatus Inicial ' + this.ESTATUS + ' y Tipo Bien ' + this.P_DIRECCION
      );
    }
  }
  loadMotifs() {
    if (goodCheck.length > 0) {
      console.log('Entra');
      let description: string = '';
      goodCheck.map((row: any) => {
        description = description + row.row.descriptionReason;

        console.log(row);
      });
      this.form.controls['reasons'].setValue(description);
      // this.excelService.export(data, { filename });
    } else {
      this.alert('warning', 'Por lo menos debe seleccionar un motivo', '');
    }
  }
  close() {
    this.modalRef.hide();
  }
}
