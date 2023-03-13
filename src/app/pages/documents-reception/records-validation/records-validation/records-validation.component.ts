import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
import { KEYGENERATION_PATTERN } from 'src/app/core/shared/patterns';
import { ProceedingsValidationsService } from './../../../../core/services/ms-proceedings/proceedings-validations.service';
import { RECORDS_VALDIATION_COLUMNS } from './records-validation-columns';

@Component({
  selector: 'app-records-validation',
  templateUrl: './records-validation.component.html',
  styles: [],
})
export class RecordsValidationComponent extends BasePage implements OnInit {
  form: FormGroup;
  fileNumber: number;
  proceedingsNumb: number;
  proceedingsCve: string;
  dataTable: any[] = [];
  correctRecords: number = 0;
  recordsCount: number = 0;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private proceedingsValidationsService: ProceedingsValidationsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: RECORDS_VALDIATION_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getParams();
    this.setForm();
    this.getInfo();
  }

  getParams() {
    this.activatedRoute.params.subscribe(params => {
      this.fileNumber = params['fileNumber'];
      console.log(this.fileNumber);
      this.proceedingsNumb = params['proceedingsNumb'];
      this.proceedingsCve = params['proceedingsCve'];
    });
  }

  setForm() {
    this.form.patchValue({
      proceedingsNumb: this.proceedingsNumb,
      proceedingsCve: this.proceedingsCve,
    });
  }

  getInfo() {
    let data: any[] = [];
    let temp: any = {};
    this.proceedingsValidationsService.getAll(this.proceedingsNumb).subscribe({
      next: resp => {
        for (let validation of resp.data) {
          (temp.secVal = validation.secVal),
            (temp.descVal = validation.proceedingsType.descVal),
            (temp.resultValue = validation.resultValue);
          if (validation.statusValue == 1) this.correctRecords++;
          this.recordsCount++;
          data.push(temp);
        }
        this.dataTable = data;
      },
      error: err => {
        if (err.status <= 404) {
          this.onLoadToast(
            'info',
            'Información',
            'No existen validadores para esta acta'
          );
        }
      },
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      proceedingsNumb: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      proceedingsCve: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
    });
  }

  OnDestroy() {
    console.log('Saliendo');
  }
}
