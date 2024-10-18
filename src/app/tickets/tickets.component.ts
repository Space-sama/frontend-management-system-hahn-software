import { Config } from './../../../node_modules/datatables.net/types/types.d';
import { Component, inject, OnInit } from '@angular/core';
import { TicketsService } from '../services/tickets.service';
import { Ticket } from '../entities/ticket';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink,DataTablesModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {

  ticketService = inject(TicketsService);
  tickets: Ticket[] = [];
  datatable_opts: Config={}
  datatable_triggers: Subject<any>= new Subject<any>();

  constructor( private router: Router) {}

  ngOnInit(): void {
    this.loadAllTickets();
    this.datatable_opts= {
      pagingType: 'full_numbers'
    }
  }

  loadAllTickets(): void {
    this.ticketService.getAllTickets().subscribe(
      (data: Ticket[]) => {
        this.tickets = data;
        this.datatable_triggers.next(null);
        console.log("----------", data);
      },
      (error) => {
        console.error('Error getting Tickets :', error);
      }
    );
  }

  deleteOne(id: number) {
    console.log(id);
    var confirm_delete = confirm("Are you Sure Want to delete this Ticket?");
    if(confirm_delete){
      this.ticketService.deleteOneTicket(id).subscribe({
        next: (res) => {
          console.log('res -----> ', res);
          Swal.fire({
            title: "The Ticket has been successfully deleted...",
            text: "",
            icon: "success"
          }).then(()=> {
            location.reload();
          });
        },

      })
    }
  }
}
