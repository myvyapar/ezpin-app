import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  showSnackBar(message: string, theme: string, duration: number) {
    this.snackBar.open(message, '', {
      duration: duration,
      panelClass: ['mat-toolbar', `mat-${theme}`],
    });
  }
}
