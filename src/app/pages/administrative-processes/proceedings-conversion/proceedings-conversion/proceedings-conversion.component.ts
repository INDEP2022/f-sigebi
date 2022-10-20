import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { BasePage } from 'src/app/core/shared/base-page';
import { ProceedingsConversionDetailComponent } from '../proceedings-conversion-detail/proceedings-conversion-detail.component';
import { PROCEEDINGSCONVERSIONS_COLUMNS, PROCEEDINGSCONVERSION_COLUMNS } from './proceedings-conversion-columns';

@Component({
  selector: 'app-proceedings-conversion',
  templateUrl: './proceedings-conversion.component.html',
  styles: [
  ]
})
export class ProceedingsConversionComponent extends BasePage implements OnInit {
  proceedingsConversionForm: ModelForm<any>;
  settings2 = { ...this.settings, actions: false };

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...PROCEEDINGSCONVERSION_COLUMNS },
    };
    this.settings2.columns = PROCEEDINGSCONVERSIONS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.proceedingsConversionForm = this.fb.group({
      idConversion: [null, Validators.required],
      noWellConverted: [null, Validators.required],
      noProceedings: [null, Validators.required],
      priorInvestigation: [null, Validators.required],
      criminalCase: [null, Validators.required],
      proceedings: [null, Validators.required],
      status: [null, Validators.required],
      trans: [null, Validators.required],
      conv: [null, Validators.required],
      admin: [null, Validators.required],
      invoice: [null, Validators.required],
      year: [null, Validators.required],
      month: [null, Validators.required],
      dateElaboration: [null, Validators.required],
      proceedingsDesc: [{ value: null, disabled: true }, Validators.required],
      address: [null, Validators.required],
      responsible: [null, Validators.required],
      witness: [null, Validators.required],
      witnessTwo: [null, Validators.required],
      witnessContr: [null, Validators.required],
    });
  }
  openProceedingsConversionDetail(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => { },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ProceedingsConversionDetailComponent, config);
  }
}
