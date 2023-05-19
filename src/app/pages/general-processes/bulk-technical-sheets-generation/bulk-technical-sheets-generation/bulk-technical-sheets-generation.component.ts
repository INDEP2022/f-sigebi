import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-bulk-technical-sheets-generation',
  templateUrl: './bulk-technical-sheets-generation.component.html',
  styles: [],
})
export class BulkTechnicalSheetsGenerationComponent
  extends BasePage
  implements OnInit
{
  form: ModelForm<any>;
  tmptrackerSelected = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private goodTrackerService: GoodTrackerService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private report: SiabService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      goodNumber: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      path: [null, [Validators.required, Validators.maxLength(4000)]],
      validate: [null],
    });
    this.getTmptracker(new ListParams());
  }

  getTmptracker(params: ListParams) {
    console.log(params);
    if (params.text) {
      params['search'] = '';
      params['filter.goodNumber'] = `$eq:${params.text}`;
    }

    this.goodTrackerService.getAllTmpTracker(params).subscribe({
      next: resp => {
        console.log(resp);
        this.tmptrackerSelected = new DefaultSelect(resp.data, resp.count);
      },
      error: error => {
        console.log(error);
        //this.tmptrackerSelected = new DefaultSelect();
      },
    });
  }
  tmptrackerState(datos: any) {
    console.log(datos);
    if (datos.validate === 'S') {
      this.form.controls['validate'].setValue(true);
    } else {
      this.form.controls['validate'].setValue(false);
    }
  }
  repSave() {
    let validate = this.form.controls['validate'].value === true ? 'S' : 'N';
    this.form.controls['goodNumber'].value;
    const { forfeitureKey } = this.form.value;

    if (!forfeitureKey) {
      this.onLoadToast('info', 'Es necesario contar con ', '');
    } else {
      const params = {
        goodNumber: this.form.controls['goodNumber'].value,
        validate: validate,
      };
      this.report.fetchReport('RINDICA_0001', params).subscribe({
        next: response => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        },
      });
    }
    console.log(this.form.value, validate);
  }
}
