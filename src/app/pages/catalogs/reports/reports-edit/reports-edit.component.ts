import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  catchError,
  finalize,
  firstValueFrom,
  of,
  tap,
  throwError,
} from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IReportConfig } from 'src/app/core/models/reportgood/report-config.model';
import { ReportConfigService } from 'src/app/core/services/reportgood/report-config.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
import { ReportConfigForm } from '../utils/report-config-form';

@Component({
  selector: 'app-reports-edit',
  templateUrl: './reports-edit.component.html',
  styles: [],
})
export class ReportsEditComponent extends BasePage implements OnInit {
  form = this.fb.group(new ReportConfigForm());
  reports = new DefaultSelect();
  @ViewChild('inputField1', { static: true })
  inputField1: ElementRef<HTMLInputElement>;
  @ViewChild('inputField2', { static: true })
  inputField2: ElementRef<HTMLInputElement>;
  @ViewChild('inputField3', { static: true })
  inputField3: ElementRef<HTMLInputElement>;
  @ViewChild('inputField4', { static: true })
  inputField4: ElementRef<HTMLInputElement>;
  file1: File;
  file2: File;
  file3: File;
  file4: File;
  imgSrc1: any = null;
  imgSrc2: any = null;
  imgSrc3: any = null;
  imgSrc4: any = null;

  constructor(
    private fb: FormBuilder,
    private reportConfigService: ReportConfigService
  ) {
    super();
  }

  ngOnInit(): void {}

  private getFileFromEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    const filename = file.name;
    return file;
  }

  inputChange1(event: Event) {
    this.file1 = this.getFileFromEvent(event);
    if (
      (event.target as HTMLInputElement).files &&
      (event.target as HTMLInputElement).files[0]
    ) {
      const file = (event.target as HTMLInputElement).files[0];

      const reader = new FileReader();
      reader.onload = e => (this.imgSrc1 = reader.result);

      reader.readAsDataURL(file);
    }
    this.inputField1.nativeElement.value = '';
  }

  inputChange2(event: Event) {
    this.file2 = this.getFileFromEvent(event);
    if (
      (event.target as HTMLInputElement).files &&
      (event.target as HTMLInputElement).files[0]
    ) {
      const file = (event.target as HTMLInputElement).files[0];

      const reader = new FileReader();
      reader.onload = e => (this.imgSrc2 = reader.result);

      reader.readAsDataURL(file);
    }
    this.inputField2.nativeElement.value = '';
  }

  inputChange3(event: Event) {
    this.file3 = this.getFileFromEvent(event);
    const files = (event.target as HTMLInputElement).files;
    if (
      (event.target as HTMLInputElement).files &&
      (event.target as HTMLInputElement).files[0]
    ) {
      const file = (event.target as HTMLInputElement).files[0];

      const reader = new FileReader();
      reader.onload = e => (this.imgSrc3 = reader.result);

      reader.readAsDataURL(file);
    }
    this.inputField3.nativeElement.value = '';
  }

  inputChange4(event: Event) {
    this.file4 = this.getFileFromEvent(event);
    const files = (event.target as HTMLInputElement).files;
    if (
      (event.target as HTMLInputElement).files &&
      (event.target as HTMLInputElement).files[0]
    ) {
      const file = (event.target as HTMLInputElement).files[0];

      const reader = new FileReader();
      reader.onload = e => (this.imgSrc4 = reader.result);

      reader.readAsDataURL(file);
    }
    this.inputField4.nativeElement.value = '';
  }

  getAllReports(params?: ListParams) {
    this.reportConfigService
      .getAll(params ?? new ListParams())
      .pipe(
        catchError(error => {
          this.reports = new DefaultSelect([], 0);
          return throwError(() => error);
        }),
        tap(response => {
          this.reports = new DefaultSelect(response.data, response.count);
        })
      )
      .subscribe();
  }

  async onSelectReport(reportConfig: IReportConfig) {
    const report = await this.getReportById(reportConfig.repConfigId);
    this.form.patchValue(report);
    this.patchImages();
  }

  async getReportById(id: number) {
    return await firstValueFrom(
      this.reportConfigService.getById(id).pipe(
        catchError(error => {
          if (error.status == 404) {
            this.alert('warning', 'El Reporte no Existe', '');
          } else if (error.status >= 500) {
            this.alert('error', UNEXPECTED_ERROR, '');
          }
          this.resetForm();
          return of({});
        })
      )
    );
  }

  patchImages() {
    const { watermarkTx, leftLogoTx, rightLogoTx, footerLogoTx } =
      this.form.value;
    this.imgSrc1 = `data:image/png;base64, ${watermarkTx}`;
    this.imgSrc2 = `data:image/png;base64, ${leftLogoTx}`;
    this.imgSrc3 = `data:image/png;base64, ${rightLogoTx}`;
    this.imgSrc4 = `data:image/png;base64, ${footerLogoTx}`;
  }

  save() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.alert('warning', 'Formulario Inválido', '');
      return;
    }
    const id = this.form.value.repConfigId;
    if (!id) {
      this.saveReport().subscribe();
      return;
    }

    this.updateReport().subscribe();
  }

  saveReport() {
    this.loading = true;
    const form = this.parseForm();
    return this.reportConfigService.create(form).pipe(
      catchError(error => {
        this.alert('error', UNEXPECTED_ERROR, '');
        return throwError(() => error);
      }),
      tap(report => {
        this.alert('success', 'Información Guardada', '');
        // this.getAllReports();
        this.reports = new DefaultSelect([report], 1);
        this.form.patchValue(report);
      }),
      finalize(() => {
        this.loading = false;
      })
    );
  }

  newReport() {
    this.resetForm();
  }

  resetForm() {
    this.form.reset();
    this.inputField1.nativeElement.value = '';
    this.inputField2.nativeElement.value = '';
    this.inputField3.nativeElement.value = '';
    this.inputField4.nativeElement.value = '';
    this.file1 = null;
    this.file2 = null;
    this.file3 = null;
    this.file4 = null;
  }

  updateReport() {
    this.loading = true;
    const id = this.form.value.repConfigId;
    const form = this.parseForm();
    return this.reportConfigService.update(id, form).pipe(
      catchError(error => {
        this.alert('error', UNEXPECTED_ERROR, '');
        return throwError(() => error);
      }),
      tap(response => {
        this.alert('success', 'Información Actualizada', '');
        this.getAllReports();
      }),
      finalize(() => {
        this.loading = false;
      })
    );
  }

  parseForm() {
    const formData = new FormData();
    formData.append('reportNb', this.form.value.reportNb);
    formData.append('descriptionNb', this.form.value.descriptionNb);
    formData.append('legendNb', this.form.value.legendNb);
    formData.append('legendTp', this.form.value.legendTp);
    formData.append('contentTx', this.form.value.contentTx);
    formData.append('watermarkTx', this.file1 ?? null);
    formData.append('leftLogoTx', this.file2 ?? null);
    formData.append('rightLogoTx', this.file3 ?? null);
    formData.append('footerLogoTx', this.file4 ?? null);
    return formData;
  }
}
