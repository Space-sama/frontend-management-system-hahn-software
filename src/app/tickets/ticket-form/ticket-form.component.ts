import { TicketsService } from './../../services/tickets.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDatepickerModule, FormsModule,
     JsonPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-form.component.html',
  styleUrl: './ticket-form.component.css'
})
export class TicketFormComponent implements OnInit, OnDestroy {

  today = inject(NgbCalendar).getToday();
	model!: NgbDateStruct;
	date!: { year: number; month: number };
  form!: FormGroup;
  ticketService = inject(TicketsService);
  ticketFormValidation!:Subscription;
  paramSubscription!:Subscription;
  edit = false;
  id=0;

  constructor(private f_b: FormBuilder, private activatedRoute: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe({
      next: (params) => {
        const ticketId = params['id'];
        this.id = ticketId;
        // If id exists
        if (ticketId) {
          this.ticketService.getOneTicket(ticketId).subscribe({
            next: (res) => {
              console.log('####', res);
              const date = new Date(res.date);
              const formattedDate = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
              };

              this.form.patchValue({
                ...res,
                date: formattedDate,
                status: res.status
              });
              this.edit = true;
            },
            error: (err) => {
              console.log(err);
            }
          });
        } else {
          console.log('Add mode: Creating new ticket');
          this.edit = false;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.createData();

  }

  ngOnDestroy(): void {
    if(this.ticketFormValidation){
      this.ticketFormValidation.unsubscribe();
    }
    if(this.paramSubscription){
      this.paramSubscription.unsubscribe();
    }

  }



  onSubmit(){


    const formValue = this.form.value;
    const formattedDate = this.formatDateWithTime(formValue.date);
    const formattedDateAsString = this.formatDateAsString(formValue.date);

    const ticketData = {
      ...formValue,
      date: formattedDate
    };

    const editTicketData = {
      ...formValue,
      date: formattedDateAsString,
      id: this.id
    };
    console.log("####### ", editTicketData);

    if (!this.edit) {

      this.ticketFormValidation = this.ticketService.addOneTicket(ticketData).subscribe({
        next:(res)=> {
          console.log("------------", res);
            Swal.fire({
              title: "The Ticket has been successfully added...",
              text: "",
              icon: "success"
            }).then(() => {
              this.router.navigateByUrl('/tickets');
            });
        },
        error: (err) =>{
          console.log(err);
            Swal.fire({
              icon: "error",
              title: "Cannot add the Ticket",
              text: "Something went wrong!",
            });
        }
      });
    }else{
      console.log("IIIIIIDDDDD ", this.id);

      this.ticketService.editOneTicket(this.id, editTicketData).subscribe(
        {next: value=> {

          Swal.fire({
            title: "The Ticket has been successfully edited...",
            text: "",
            icon: "success"
          }).then(() => {
            this.router.navigateByUrl('/tickets');
          });
        },error:(err)=>{
          console.log("err ---->", err);

          Swal.fire({
            title: "Cannot update the Ticket...",
            text: "",
            icon: "warning"
          }).then(() => {
            this.router.navigateByUrl('/tickets');
          });
        }}
      )
    }

  }


  // creating data form
  createData(): void {
    this.form = this.f_b.group({
      description:['', Validators.required],
      status:['', Validators.required],
      date:['', Validators.required],

    });
  }


  // format date
  formatDateWithTime(date: { year: number, month: number, day: number }): string {
    const currentDate = new Date();

    // Date Format (yyyy-MM-dd)
    const formattedDate = `${date.year}-${('0' + date.month).slice(-2)}-${('0' + date.day).slice(-2)}`;

    // Date Time Format --> (HH:mm:ss)
    const hours = ('0' + currentDate.getHours()).slice(-2);
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
    const seconds = ('0' + currentDate.getSeconds()).slice(-2);

    return `${formattedDate}T${hours}:${minutes}:${seconds}`;
  }

  formatDateAsString(date: { year: number, month: number, day: number }): string {
    return `${date.year}-${('0' + date.month).slice(-2)}-${('0' + date.day).slice(-2)}`;
  }





}
