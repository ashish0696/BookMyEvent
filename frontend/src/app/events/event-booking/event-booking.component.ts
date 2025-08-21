import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../shared/toast/toast.service';
import { EventsService, EventItem } from '../events.service';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EventBookConfirmDialog } from '../event-booking/event-book-confirm/event-book-confirm.dialog';

@Component({
  selector: 'app-event-booking',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, ReactiveFormsModule, MatIconModule, MatDialogModule, MatButtonModule],
  templateUrl: './event-booking.html',
  styleUrls: ['./event-booking.css']
 
})
export class EventBookingComponent implements OnInit {
  event?:EventItem; loading=true; booking=false;
  selected = new Set<string>(); 
  editForm = this.fb.group({ title:['', Validators.required], location:['', Validators.required], startDateTime:['', Validators.required] });
  constructor(private route:ActivatedRoute, private events:EventsService, private router:Router, private fb:FormBuilder, private toast:ToastService, private dialog: MatDialog){}
  ngOnInit(){
    const id=Number(this.route.snapshot.paramMap.get('id'));
    this.events.detail(id).subscribe({
      next: res => {
        if (res?.error) {
          this.loading = false;
        } else {
          this.event = res;
          this.editForm.patchValue({ title: res.title, location: res.location, startDateTime: res.startDateTime });
          this.loading = false;
        }
      },
      error: err => {
        this.loading = false;
      }
    });
  }
  get selectedList(): string {
    return Array.from(this.selected).map(k=>{
      const [r,c] = k.split(',').map(Number);
      return `${this.rowLabel(r)}${c+1}`;
    }).join(', ');
  }
  key(r:number,c:number){ return `${r},${c}`; }
  isSelected(r:number,c:number){ return this.selected.has(this.key(r,c)); }
  toggleSeat(r:number,c:number){
    if(!this.event) return;
    if(this.event.seatMap[r][c] === 'X') return; 
    const k = this.key(r,c);
    if(this.selected.has(k)) this.selected.delete(k); else this.selected.add(k);
  }
  async bookSelected(){
    if(!this.event || this.selected.size === 0) return;
    const seatsList = Array.from(this.selected).map(k=>{
      const [r,c] = k.split(',').map(Number); return `${this.rowLabel(r)}${c+1}`;
    }).join(', ');

    const ref = this.dialog.open(EventBookConfirmDialog, { data: { seatsList, eventTitle: this.event.title } });
    const result = await ref.afterClosed().toPromise();
    if (!result) return; 
    if (result === 'back') {
      this.back();
      return;
    }

    this.booking = true;
    let bookingFailed = false;
    try{
      for(const k of Array.from(this.selected)){
        const [r,c] = k.split(',').map(Number);
        const res = await firstValueFrom(this.events.book(this.event.id, r+1, c+1));
        if (res.error) {
          bookingFailed = true;
        } else {
          this.event.seatMap[r][c] = 'X';
        }
      }
      if (bookingFailed) {
        this.toast.error('Booking failed');
      } else {
        this.toast.success('Booking successful');
      }
      this.selected.clear();
    }catch(err:any){
      this.toast.error('Booking failed');
    }finally{
      this.booking = false;
    }
  }
  back(){ this.router.navigate(['/events']); }
  save(){
    if(!this.event) return;
    const id = this.event.id;
    this.events.update(id, this.editForm.value as any).subscribe({
      next: res => {
        if (res.error) {
        } else {
          this.event = { ...this.event!, ...res };
        }
      },
      error: err => {
      }
    });
  }
  cancelSelection() {
    this.selected.clear();
  }
 
  rowLabel(r: number): string {
    return String.fromCharCode(65 + r);
  }

  
}
