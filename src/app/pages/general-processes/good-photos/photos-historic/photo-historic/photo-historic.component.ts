import { Component, OnInit, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs';
import { FilePhotoService } from 'src/app/core/services/ms-ldocuments/file-photo.service';
import { NO_IMAGE_FOUND, PhotoClassComponent } from '../../models/photo-class';

@Component({
  selector: 'app-photo-historic',
  templateUrl: './photo-historic.component.html',
  styleUrls: ['./photo-historic.component.css'],
})
export class PhotoHistoricComponent
  extends PhotoClassComponent
  implements OnInit
{
  usuarioElimina: string =
    'Usuario eliminó moto1.jpg ' + 'Nombre: SIGEBIADMON Fecha: 29/06/2023';
  constructor(private service: FilePhotoService) {
    super();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filename']) {
      this.filenameChange();
    }
  }

  private filenameChange() {
    this.loading = true;
    let index = this.filename.indexOf('F');
    console.log(index);
    this.service
      .getById(this.goodNumber, +this.filename.substring(index + 1, index + 5))
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.loading = false;
          this.error = false;
          // this.usuarioElimina = response.usuarioElimina;
          this.base64Change(response);
          console.log(this.error);
        },
        error: error => {
          // this.alert('error', 'Fotos', 'Ocurrio un error al cargar la foto');
          this.loading = false;
          this.error = true;
          console.log(this.error);
          this.imgSrc = NO_IMAGE_FOUND;
        },
      });
  }
}
