import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketsService } from './tickets.service';
import { Ticket } from '../entities/ticket';
import { HttpErrorResponse } from '@angular/common/http';

describe('TicketsService', () => {
  let service: TicketsService;
  let httpMock: HttpTestingController;

  const mockTickets: Ticket[] = [
    { id: 1, description: 'Test Ticket 1', status: 'Open', date: new Date() },
    { id: 2, description: 'Test Ticket 2', status: 'Closed', date: new Date() },
    // { id: 3, description: 'Test Ticket 3', status: 'Open', date: new Date() }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketsService]
    });

    service = TestBed.inject(TicketsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all tickets', () => {
    service.getAllTickets().subscribe(tickets => {
      expect(tickets.length).toBe(2);
      expect(tickets).toEqual(mockTickets);
    });

    const req = httpMock.expectOne('http://localhost:5109/api/Ticket');
    expect(req.request.method).toBe('GET');
    req.flush(mockTickets);
  });

  it('should add a new ticket', () => {
    // Create a new ticket with valid data
    const newTicket: Ticket = { id: 1076, description: 'description here', status: 'Open', date: new Date() };

    service.addOneTicket(newTicket).subscribe(ticket => {
      // Expect the response to match the ticket returned from the API
      expect(ticket).toEqual({
        id: 1076,
        description: 'description here',
        status: 'Open',
        date: new Date().toISOString()
      });
    });

    const req = httpMock.expectOne('http://localhost:5109/api/Ticket');
    expect(req.request.method).toBe('POST');

    req.flush({
      id: 1076,
      description: 'description here',
      status: 'Open',
      date: new Date().toISOString() // Mocking the date as ISO string
    }, { status: 201, statusText: 'Created' });
  });


  it('should handle creation with one empty field nd return validation error', () => {
    const mockData: Ticket = { id: 4, description: '', status: 'Open', date: new Date() };

    service.addOneTicket(mockData).subscribe(
      response => {
        fail('Expected an error, but a response');
      },
      (error: HttpErrorResponse) => {
        // Expect the error of 400 Bad Request
        expect(error.status).toBe(400);
        expect(error.error).toEqual({
          type: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
          title: "One or more validation errors occurred.",
          status: 400,
          errors: {
            Description: [
              "Description is required !"
            ]
          },
          traceId: jasmine.any(String),

        });

      }
    );
    const req = httpMock.expectOne('http://localhost:5109/api/Ticket');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);

    req.flush({
      type: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
      title: "One or more validation errors occurred.",
      status: 400,
      errors: {
        Description: [
          "Description is required !"
        ]
      },
      traceId: jasmine.any(String),
    }, { status: 400, statusText: 'Bad Request' });
  });

  it('should retrieve a ticket by id', () => {
    service.getOneTicket(1).subscribe(ticket => {
      expect(ticket).toEqual(mockTickets[0]);
    });

    const req = httpMock.expectOne('http://localhost:5109/api/Ticket/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTickets[0]);
  });

  it('should delete a ticket by id', () => {
    service.deleteOneTicket(1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    // FAILED id not match
    // service.deleteOneTicket(16).subscribe(response => {
    //   expect(response).toBeTruthy();
    // });

    const req = httpMock.expectOne('http://localhost:5109/api/Ticket/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should edit a ticket', () => {
    const editedTicket: Ticket = { id: 1, description: 'Edited Ticket', status: 'Open', date: new Date() };

    service.editOneTicket(1, editedTicket).subscribe(ticket => {
      expect(ticket).toEqual(editedTicket);
    });

    const req = httpMock.expectOne('http://localhost:5109/api/Ticket/1');
    expect(req.request.method).toBe('PUT');
    req.flush(editedTicket);
  });
});
