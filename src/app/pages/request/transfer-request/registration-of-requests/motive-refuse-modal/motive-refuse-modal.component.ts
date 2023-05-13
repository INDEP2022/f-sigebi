import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-motive-refuse-modal',
  templateUrl: './motive-refuse-modal.component.html',
  styles: [],
})
export class MotiveRefuseModalComponent implements OnInit {
  dataRequest: any;
  form: FormGroup = new FormGroup({});
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private requestService: RequestService,
    private bsModelRef: BsModalRef
  ) {}

  ngOnInit(): void {
    console.log(this.dataRequest);
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      rejectionComment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  confirm() {
    this.update();
  }

  update() {
    const obj: IRequest = {
      rejectionComment: this.form.controls['rejectionComment'].value,
    };
    this.requestService.update(this.dataRequest.id, obj).subscribe({
      next: data => {
        this.handleSuccess();
      },
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = 'Guardado';
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
