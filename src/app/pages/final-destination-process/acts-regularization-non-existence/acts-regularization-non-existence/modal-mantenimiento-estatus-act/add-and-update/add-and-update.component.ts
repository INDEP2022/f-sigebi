import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-add-and-update',
  templateUrl: './add-and-update.component.html',
  styles: [],
})
export class AddAndUpdateComponent extends BasePage implements OnInit {
  form: FormGroup;
  @Output() onSave = new EventEmitter<boolean>();
  status = new DefaultSelect<any>();
  constructor(
    private modalRef: BsModalRef,
    private screenStatusService: ScreenStatusService,
    private fb: FormBuilder,
    private statusGoodService: StatusGoodService
  ) {
    super();
  }
  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      status: [null, Validators.required],
      description: [null],
      screenKey: ['FACTDESACTASRIF'],
      statusFinal: ['RIF'],
    });
  }

  save() {
    this.screenStatusService.createStatusXScreen(this.form.value).subscribe({
      next: (response: any) => {
        this.alert('success', 'Registro guardado correctamente', '');
        this.onSave.emit(true);
        this.close();
      },
      error: () => {
        this.alert('warning', 'No se pudo crear el registro', '');
      },
    });
  }

  statusList(lparams: ListParams) {
    if (lparams.text)
      lparams['filter.status'] = `${SearchFilter.ILIKE}:${lparams.text}`;
    this.statusGoodService.getAl1(lparams).subscribe({
      next: (data: any) => {
        let result = data.data.map(item => {
          item['statusAndDescrip'] = item.status + ' - ' + item.description;
        });
        Promise.all(result).then(resp => {
          this.status = new DefaultSelect(data.data, data.count);
        });
      },
      error: error => {
        this.status = new DefaultSelect();
      },
    });
  }
  selectStatus($event: any) {
    if ($event) {
      this.form.get('description').setValue($event.description);
    } else {
      this.form.get('description').setValue(null);
    }
  }
  close() {
    this.modalRef.hide();
  }
}
