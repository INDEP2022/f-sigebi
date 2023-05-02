import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'cpp-form',
  templateUrl: './cpp-form.component.html',
  styles: [],
})
export class CppFormComponent implements OnInit, OnChanges {
  @Input() form: FormGroup<{
    copies: FormArray<
      FormGroup<{
        id: FormControl<string>;
        name: FormControl<string>;
      }>
    >;
  }>;
  @Input() users: any[] = [];
  @Input() disabled: boolean = false;

  get copies() {
    return this.form.controls.copies;
  }
  constructor(private fb: FormBuilder) {}
  ngOnChanges(changes: SimpleChanges): void {
    const { users } = changes;
    if (users) {
      this.setUsers();
    }
  }

  ngOnInit(): void {
    if (this.copies.length === 0) {
      this.addCopy();
    }
  }

  setUsers() {
    this.copies.clear();
    if (this.users.length) {
      this.users.forEach(user => {
        const { id, name } = user;
        const item = this.getItem(id, name);
        this.copies.push(item);
      });
    }
  }

  getDefaultSelect() {
    return new DefaultSelect(this.users, this.users.length);
  }

  removeCopy(index: number) {
    this.copies.removeAt(index);
  }

  addCopy() {
    this.copies.push(this.getItem());
  }

  getItem(id: string = null, name: string = null) {
    return this.fb.group({
      id: new FormControl(id, [Validators.required]),
      name: new FormControl(name),
    });
  }
}
