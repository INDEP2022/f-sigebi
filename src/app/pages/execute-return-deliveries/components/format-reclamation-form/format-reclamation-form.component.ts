import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-format-reclamation-form',
  templateUrl: './format-reclamation-form.component.html',
  styles: [],
})
export class FormatReclamationFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      responsible: [null, [Validators.required]],
      charge: [null, [Validators.required]],
      check: [null],
    });
  }

  confirm() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
