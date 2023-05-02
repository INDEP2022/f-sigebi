import { Component, OnInit } from '@angular/core';
import { AtachedDocumentsService } from 'src/app/core/services/ms-documents/attached-documents.service';

@Component({
  selector: 'app-text-change',
  templateUrl: './text-change.component.html',
  styles: [],
})
export class TextChangeComponent implements OnInit {
  constructor(private atachedDocumentsService: AtachedDocumentsService) {}

  ngOnInit(): void {
    this.atachedDocumentsService.getAllFilter().subscribe({
      next: resp => {
        // this.itemsJsonBienes = [...resp.data];
        console.log(JSON.stringify([...resp.data]));
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }
  onLoadToast(arg0: string, arg1: string, error: string) {
    throw new Error('Method not implemented.');
  }
}
