import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;

  constructor(
    private loginService: LoginService,
    public dialogRef: MatDialogRef<ForgetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.forgetPasswordForm = new FormGroup({
      username: new FormControl('', [Validators.required])
    });
  }

  get form() {
    return this.forgetPasswordForm.controls;
  }

  submitForm() {
    if (this.forgetPasswordForm.invalid) {
      return;
    }

    this.loginService.forgetPassword(this.forgetPasswordForm.value).subscribe(
      (data) => {
        this.snackBarService.showSnackBar(
          'Send mail successfully',
          'primary',
          2000
        );
        this.dialogRef.close();
      },
    );
  }
}
