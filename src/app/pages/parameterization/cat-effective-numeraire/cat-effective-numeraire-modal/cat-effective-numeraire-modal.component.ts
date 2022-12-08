import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cat-effective-numeraire-modal',
  templateUrl: './cat-effective-numeraire-modal.component.html',
  styles: [],
})
export class CatEffectiveNumeraireModalComponent implements OnInit {
  title: string = 'Categoria para numerario de efectivo';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      category: [null, [Validators.required]],
      description: [null, [Validators.required]],
      entry: [null, [Validators.required]],
      exit: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
