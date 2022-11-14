import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-c-c-epf-c-event-process-form',
  templateUrl: './c-c-epf-c-event-process-form.component.html',
  styles: [
  ]
})
export class CCEpfCEventProcessFormComponent extends BasePage implements OnInit {

  status: string = 'Nueva';
  edit: boolean = false;

  form: FormGroup = new FormGroup({});
  eventProcess: any;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      goodType: [null,[Validators.required]],
      event: [null,[Validators.required]],
      phase: [null,[Validators.required]],
      warrantyDate: [null,[Validators.required]],
      year: [null,[Validators.required]],
      isPublished: [null,[Validators.required]],
    });
    
    if (this.edit) {
      //console.log(this.brand)
      this.status = 'Actualizar';
      this.form.patchValue(this.eventProcess);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    
    this.loading = true;
    this.handleSuccess();
    /*this.bankService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );*/
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
    /*this.bankService.update(this.bank.bankCode, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );*/
  }

}
