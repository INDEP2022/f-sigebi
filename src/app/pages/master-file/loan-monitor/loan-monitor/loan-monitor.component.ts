import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { LOAN_MONITOR_COLUMNS } from './loan-monitor-columns';

@Component({
  selector: 'app-loan-monitor',
  templateUrl: './loan-monitor.component.html',
  styles: [],
})
export class LoanMonitorComponent extends BasePage implements OnInit {
  form: FormGroup;
  data1: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: LOAN_MONITOR_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {},
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null, [Validators.required, Validators.maxLength(10)]],
      borrowedTo: [null, [Validators.required, Validators.maxLength(10)]],

      document: [null, [Validators.required, Validators.maxLength(10)]],
      adscritTo: [null, [Validators.required, Validators.maxLength(10)]],
    });
  }

  loadData() {
    this.data1.load(testData);
  }

  onSubmit(event: any) {
    console.log(this.form.value);
    console.log(this.params.getValue());

    this.data1.load(testData);
    this.totalItems = testData.length;
  }
}

const testData = [
  {
    noRecord: '001',
    documentType: 'Documento 1',
    documentDescription: 'Descripción 1',
    nature: 'Naturaleza 1',
    borrowTo: 'Usuario 1',
    adscrito: 'Adscrito 1',
    borrowDate: '2023-09-22',
    devolutionDate: '2023-09-30',
    devolutionDateReal: '2023-10-05',
  },
  {
    noRecord: '002',
    documentType: 'Documento 2',
    documentDescription: 'Descripción 2',
    nature: 'Naturaleza 2',
    borrowTo: 'Usuario 2',
    adscrito: 'Adscrito 2',
    borrowDate: '2023-09-23',
    devolutionDate: '2023-10-01',
    devolutionDateReal: '2023-10-04',
  },
  {
    noRecord: '003',
    documentType: 'Documento 3',
    documentDescription: 'Descripción 3',
    nature: 'Naturaleza 3',
    borrowTo: 'Usuario 3',
    adscrito: 'Adscrito 3',
    borrowDate: '2023-09-24',
    devolutionDate: '2023-10-02',
    devolutionDateReal: '2023-10-06',
  },
  {
    noRecord: '004',
    documentType: 'Documento 4',
    documentDescription: 'Descripción 4',
    nature: 'Naturaleza 4',
    borrowTo: 'Usuario 4',
    adscrito: 'Adscrito 4',
    borrowDate: '2023-09-25',
    devolutionDate: '2023-10-03',
    devolutionDateReal: '2023-10-07',
  },
  {
    noRecord: '005',
    documentType: 'Documento 5',
    documentDescription: 'Descripción 5',
    nature: 'Naturaleza 5',
    borrowTo: 'Usuario 5',
    adscrito: 'Adscrito 5',
    borrowDate: '2023-09-26',
    devolutionDate: '2023-10-04',
    devolutionDateReal: '2023-10-08',
  },
  {
    noRecord: '006',
    documentType: 'Documento 6',
    documentDescription: 'Descripción 6',
    nature: 'Naturaleza 6',
    borrowTo: 'Usuario 6',
    adscrito: 'Adscrito 6',
    borrowDate: '2023-09-27',
    devolutionDate: '2023-10-05',
    devolutionDateReal: '2023-10-09',
  },
  {
    noRecord: '007',
    documentType: 'Documento 7',
    documentDescription: 'Descripción 7',
    nature: 'Naturaleza 7',
    borrowTo: 'Usuario 7',
    adscrito: 'Adscrito 7',
    borrowDate: '2023-09-28',
    devolutionDate: '2023-10-06',
    devolutionDateReal: '2023-10-10',
  },
  {
    noRecord: '008',
    documentType: 'Documento 8',
    documentDescription: 'Descripción 8',
    nature: 'Naturaleza 8',
    borrowTo: 'Usuario 8',
    adscrito: 'Adscrito 8',
    borrowDate: '2023-09-29',
    devolutionDate: '2023-10-07',
    devolutionDateReal: '2023-10-11',
  },
  {
    noRecord: '009',
    documentType: 'Documento 9',
    documentDescription: 'Descripción 9',
    nature: 'Naturaleza 9',
    borrowTo: 'Usuario 9',
    adscrito: 'Adscrito 9',
    borrowDate: '2023-09-30',
    devolutionDate: '2023-10-08',
    devolutionDateReal: '2023-10-12',
  },
  {
    noRecord: '010',
    documentType: 'Documento 10',
    documentDescription: 'Descripción 10',
    nature: 'Naturaleza 10',
    borrowTo: 'Usuario 10',
    adscrito: 'Adscrito 10',
    borrowDate: '2023-10-01',
    devolutionDate: '2023-10-09',
    devolutionDateReal: '2023-10-13',
  },
  {
    noRecord: '011',
    documentType: 'Documento 11',
    documentDescription: 'Descripción 11',
    nature: 'Naturaleza 11',
    borrowTo: 'Usuario 11',
    adscrito: 'Adscrito 11',
    borrowDate: '2023-10-02',
    devolutionDate: '2023-10-10',
    devolutionDateReal: '2023-10-14',
  },
  {
    noRecord: '012',
    documentType: 'Documento 12',
    documentDescription: 'Descripción 12',
    nature: 'Naturaleza 12',
    borrowTo: 'Usuario 12',
    adscrito: 'Adscrito 12',
    borrowDate: '2023-10-03',
    devolutionDate: '2023-10-11',
    devolutionDateReal: '2023-10-15',
  },
  {
    noRecord: '013',
    documentType: 'Documento 13',
    documentDescription: 'Descripción 13',
    nature: 'Naturaleza 13',
    borrowTo: 'Usuario 13',
    adscrito: 'Adscrito 13',
    borrowDate: '2023-10-04',
    devolutionDate: '2023-10-12',
    devolutionDateReal: '2023-10-16',
  },
  {
    noRecord: '014',
    documentType: 'Documento 14',
    documentDescription: 'Descripción 14',
    nature: 'Naturaleza 14',
    borrowTo: 'Usuario 14',
    adscrito: 'Adscrito 14',
    borrowDate: '2023-10-05',
    devolutionDate: '2023-10-13',
    devolutionDateReal: '2023-10-17',
  },
  {
    noRecord: '015',
    documentType: 'Documento 15',
    documentDescription: 'Descripción 15',
    nature: 'Naturaleza 15',
    borrowTo: 'Usuario 15',
    adscrito: 'Adscrito 15',
    borrowDate: '2023-10-06',
    devolutionDate: '2023-10-14',
    devolutionDateReal: '2023-10-18',
  },
];
