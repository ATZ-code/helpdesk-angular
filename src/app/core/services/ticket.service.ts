import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Ticket,
  TicketResponse,
  TicketComment,
  CommentsResponse,
  CreateCommentResponse
} from '../models/ticket.model';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = environment.apiUrl;


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // OBTENER TICKETS
  // =====================================================

  getTickets(
    status?: string,
    priority?: string,
    page: number = 1,
    limit: number = 10
  ): Observable<TicketResponse> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());


    if (status) {

      params = params.set(
        'status',
        status
      );

    }


    if (priority) {

      params = params.set(
        'priority',
        priority
      );

    }


    return this.http.get<TicketResponse>(
      `${this.apiUrl}/tickets`,
      { params }
    );

  }


  // =====================================================
  // CREAR TICKET
  // =====================================================

  createTicket(data: {
    title: string;
    description: string;
    priority: string;
  }): Observable<{ data: Ticket }> {

    return this.http.post<{ data: Ticket }>(
      `${this.apiUrl}/tickets`,
      data
    );

  }


  // =====================================================
  // OBTENER DETALLE DEL TICKET
  // =====================================================

  getTicket(
    id: string
  ): Observable<{ data: Ticket }> {

    const params = new HttpParams()
      .set(
        '_t',
        Date.now().toString()
      );


    const url =
      `${this.apiUrl}/tickets/${id}`;


    console.log(
      'GET DETALLE:',
      url
    );


    return this.http.get<{ data: Ticket }>(
      url,
      { params }
    );

  }


  // =====================================================
  // OBTENER COMENTARIOS
  // =====================================================

  getComments(
    ticketId: string
  ): Observable<CommentsResponse> {

    const url =
      `${this.apiUrl}/tickets/${ticketId}/comments`;


    console.log(
      'GET COMENTARIOS:',
      url
    );


    return this.http.get<CommentsResponse>(
      url
    );

  }


  // =====================================================
  // CREAR COMENTARIO
  // =====================================================

  createComment(
    ticketId: string,
    body: string
  ): Observable<CreateCommentResponse> {

    const url =
      `${this.apiUrl}/tickets/${ticketId}/comments`;


    console.log(
      'POST COMENTARIO:',
      url
    );


    return this.http.post<CreateCommentResponse>(
      url,
      {
        body
      }
    );

  }

}