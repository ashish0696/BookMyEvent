import { ToastService } from '../../shared/toast/toast.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule, MatIconModule],
  styleUrl: './login.css'
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)
    ]]
  });
  loading=false; error='';
  private returnUrl: string | null = null;
  constructor(private fb:FormBuilder, private auth:AuthService, private router:Router, private toast:ToastService, private route:ActivatedRoute){
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }
  submit(){
    if(this.form.invalid) return;
    this.loading=true; this.error='';
    this.auth.login(this.form.value as any).subscribe({
      next: res => {
        if (res.error) {
          this.error = res.feildErrors?.join(', ') || res.message || 'Login failed';
          this.toast.error('Invalid Credentials');
          this.loading = false;
        } else {
          this.toast.success('Logged in successfully');
          const dest = this.returnUrl || '/events';
          this.router.navigateByUrl(dest, { replaceUrl: true });
            }
      },
      error: err => {
  this.error = err.feildErrors?.join(', ') || err.message || 'Login failed';
  this.toast.error('Invalid Credentials');
  this.loading = false;
      }
    });
  }
}
