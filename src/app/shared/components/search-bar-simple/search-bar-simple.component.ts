import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'search-bar-simple',
  template: `
    <div
      class="form-material form-group form-secondary d-flex justify-content-center">
      <label class="search-label">{{ label }}</label>
      <div class="text-search ">
        <input
          type="number"
          class="form-control"
          [formControl]="search"
          [placeholder]="placeholder"
          [(ngModel)]="term" />
      </div>
      <div>
        <button
          [disabled]="!getValue()"
          type="submit"
          (click)="searchTerm()"
          class="btn btn-primary btn-sm active ml-1">
          <i class="fa fa-search"></i
          ><span [ngClass]="{ 'ml-2': valueBut != '' }">{{ valueBut }}</span>
        </button>
        <!-- <input
          value="{{ valueBut }}"
          (click)="searchTerm()"
          type="submit"
          class="btn btn-primary active ml-1" /> -->
      </div>
    </div>
  `,
  styles: [],
})
export class SearchBarSimpleComponent implements OnInit {
  @Input() label?: string = 'Buscar:';
  @Input() placeholder?: string = 'Placeholder...';
  @Input() valueBut?: string = '';
  @Output() eventEmit = new EventEmitter<string>();
  term: string = '';

  search: FormControl = new FormControl();
  constructor() {}

  ngOnInit(): void {}

  getValue() {
    if (this.term == '') return false;
    return true;
  }

  searchTerm() {
    this.eventEmit.emit(this.term);
  }
}
