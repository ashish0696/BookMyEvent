import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  constructor(private router: Router, private toast: ToastService) {}

  isAuthed(): boolean {
    return !!sessionStorage.getItem('jwt');
  }
    logout(){
      sessionStorage.removeItem('jwt');
      this.router.navigate(['']);
      this.toast.success('Logged out Successfully');
    }
  // ...existing code...zzzz

}
