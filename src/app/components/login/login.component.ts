import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private _email = new FormControl('', [Validators.required, Validators.email]);
  private _password = new FormControl('', Validators.required);

  public get email() {
    return this._email;
  }
  public get password() {
    return this._password;
  }
  constructor(private _authService: AuthService) {
  }

  ngOnInit(): void {
    combineLatest([
      this.email.valueChanges,
      this.password.valueChanges
    ]).subscribe(([email, pass]) => console.log(email, pass))
  }

  onSubmit() {
    if (this.email.invalid || this.password.invalid) {
      return;
    }

    this._authService.login(
      this.email.value as string,
      this.password.value as string
    ).subscribe()
  }
}
