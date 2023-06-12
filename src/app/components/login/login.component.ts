import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private _email = new FormControl('', [Validators.required, Validators.email]);
  private _password = new FormControl('', Validators.required);

  public get email() {
    return this._email;
  }
  public get password() {
    return this._password;
  }

  constructor(
    private _authService: AuthService,
    private _snackbar: SnackbarService,
    private _router: Router,
  ) {
  }

  onSubmit() {
    if (this.email.invalid || this.password.invalid) {
      return;
    }

    this._authService.login(
      this.email.value as string,
      this.password.value as string
    ).subscribe(session => {
      this._router.navigate(['/orders']);
      this._snackbar.success(`Bienvenue, ${session?.user?.email}`);
    })
  }
}
