import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface SnackbarOptions extends MatSnackBarConfig {
  level?: 'success' | 'error' | 'warning' | 'info';
  horizontalPosition?: 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private static readonly STATUS_CLASS = {
    success: 'custom-snackbar--success',
    error: 'custom-snackbar--error',
    warning: 'custom-snackbar--warning',
    info: 'custom-snackbar--info',
  };

  private static readonly DEFAULT_OPTIONS: SnackbarOptions = {
    duration: 40000,
    horizontalPosition: 'left',
    verticalPosition: 'bottom',
    panelClass: [SnackbarService.STATUS_CLASS['info']],
  };

  constructor(private _snackbar: MatSnackBar) { }

  show(message: string, options?: SnackbarOptions) {
    const mergedOptions = { ...SnackbarService.DEFAULT_OPTIONS, ...options };
    const { level, horizontalPosition, verticalPosition, ...config } = mergedOptions;

    const panelClass = [
      SnackbarService.STATUS_CLASS[level || 'info'],
    ];

    this._snackbar.open(message, 'OK', { ...config, panelClass, horizontalPosition, verticalPosition });
  }

  success(message: string) {
    this.show(message, { level: 'success' })
  }

  error(message: string) {
    this.show(message, { level: 'error' })
  }

  info(message: string) {
    this.show(message, { level: 'info' })
  }

  warning(message: string) {
    this.show(message, { level: 'warning' })
  }
}
