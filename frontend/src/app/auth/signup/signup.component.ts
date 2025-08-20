import { ToastService } from '../../shared/toast/toast.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule, MatIconModule],
  styleUrl: './signup.css'
})
export class SignupComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)
    ]],
    confirmPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,}$/)
    ]],
    contact: ['', [
      Validators.required,
      Validators.pattern(/^.{10,}$/)
    ]],
    address: ['', [Validators.required, Validators.minLength(10)]]
  }, { validators: [(g: AbstractControl) => {
    const pw = g.get('password')?.value;
    const cp = g.get('confirmPassword')?.value;
    return pw === cp ? null : { passwordMismatch: true };
  }] });
  loading=false; error=''; success='';
  constructor(private fb:FormBuilder, private auth:AuthService, private router:Router, private toast:ToastService){}
  submit(){
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    // strip confirmPassword before sending to backend
    const payload = {
      email: this.form.value.email,
      password: this.form.value.password,
      contact: this.form.value.contact,
      address: this.form.value.address,
    };
    this.auth.signup(payload as any).subscribe({
      next: res => {
        if (res.error) {
          this.error = res.feildErrors?.join(', ') || res.message || 'Signup failed';
          this.toast.error(this.error);
          this.loading = false;
        } else {
          this.success = res.message || 'Signup successful. Redirecting...';
          this.toast.success('Registered successfully');
          setTimeout(()=> this.router.navigate(['/login']), 1200);
        }
      },
      error: err => {
        this.error = err.feildErrors?.join(', ') || err.message || 'Signup failed';
        this.toast.error('Email already Registered');
        this.loading = false;
      }
    });
  }
}
