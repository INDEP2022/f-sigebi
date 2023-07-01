import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs';
import { FilePhotoService } from 'src/app/core/services/ms-ldocuments/file-photo.service';
import { firstFormatDate } from 'src/app/shared/utils/date';
import { NO_IMAGE_FOUND, PhotoClassComponent } from '../../models/photo-class';

@Component({
  selector: 'app-photo-historic',
  templateUrl: './photo-historic.component.html',
  styleUrls: ['./photo-historic.component.scss'],
})
export class PhotoHistoricComponent
  extends PhotoClassComponent
  implements OnInit
{
  @Input() userDeleted: string;
  deletedDateString: string;
  @Input() deletedDate: Date;
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
    if (changes['deletedDate']) {
      this.deletedDateString = firstFormatDate(
        changes['deletedDate'].currentValue
      );
    }
  }

  private filenameChange() {
    this.loading = true;
    let index = this.filename.indexOf('F');
    console.log(index);
    this.service
      .getByIdHistoric(
        this.goodNumber,
        +this.filename.substring(index + 1, index + 11)
      )
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);

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
