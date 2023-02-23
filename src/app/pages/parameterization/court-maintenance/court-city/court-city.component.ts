import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CourtByCityService } from 'src/app/core/services/catalogs/court-by-city.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-court-city',
  templateUrl: './court-city.component.html',
  styles: [],
})
export class CourtCityComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  id: string | number = null;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private courtCityServ: CourtByCityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      city: [null, Validators.required],
      court: [this.id, Validators.required],
    });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.onLoadToast('success', 'Se ha guardado la ciudad', '');
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  confirm() {
    this.courtCityServ.create(this.form.value).subscribe({
      next: () => this.handleSuccess(),
      error: err => this.onLoadToast('error', err.error.message, ''),
    });
  }
}
