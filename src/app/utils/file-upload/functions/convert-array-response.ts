import { HttpErrorResponse } from '@angular/common/http';

export function convertArrayResponse(response: any) {
  if (!response.data[0]) {
    const error = new HttpErrorResponse({
      status: 404,
    });
    throw error;
  }
  return response.data[0];
}
