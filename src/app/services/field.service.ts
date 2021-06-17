import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Field, FieldDescriptor, FieldDescriptorClass, FieldValue } from '../models/field.model';
import { StatusMessage } from '../models/misc.model';
import { ErrorService } from './error.service';
import { retryWithBackoff } from '../helpers/retryWithBackoff.helper';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
  ) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();

  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log('Field service data refresh called!');
    this.dataRefreshSource.next();
  }

  /**
   * Fetch all fields with thier descriptors
   */
  listFields(): Observable<Field[]> {
    return this.http.get<Field[]>(`${environment.baseUrl}/fields`).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Fields'))
    );
  }

  /**
   * Fetch all the descriptors for a given field.
   * @param fieldId Field GUID you want to fetch descriptors for.
   */
  getField(fieldId: string|string[]): Observable<FieldDescriptor[]> {
    return this.http.get<FieldDescriptor[]>(`${environment.baseUrl}/fields/${fieldId}`).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Field'))
    );
  }

  getFieldMulti(fieldId: string|string[]): Observable<FieldDescriptor[]> {
    const field_id = fieldId;
    return this.http.post<FieldDescriptor[]>(`${environment.baseUrl}/fields/multi`, { field_id }).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Field'))
    );
  }

  getFieldDetails(fieldId: string): Observable<FieldDescriptor> {
    return this.http.get<FieldDescriptor>(`${environment.baseUrl}/fields/${fieldId}/details`).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Field Details'))
    );
  }

  addField(field: Field): Observable<Field> {
    return this.http.post<Field>(`${environment.baseUrl}/fields`, { field }).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Add Field'))
    );
  }

  updateField(field: Field): Observable<Field> {
    return this.http.put<Field>(`${environment.baseUrl}/fields`, { field }).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Field'))
    );
  }

  archiveField(field: Field): Observable<StatusMessage> {
    return this.http.get<StatusMessage>(`${environment.baseUrl}/fields/${field.id}`).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Field'))
    );
  }

  addDescriptor(descriptor: FieldDescriptor): Observable<FieldDescriptor> {
    return this.http.post<FieldDescriptor>(`${environment.baseUrl}/fields/descriptor`, { descriptor }).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Field'))
    );
  }

  updateDescriptor(descriptor: FieldDescriptor) {
    return this.http.put<FieldDescriptor>(`${environment.baseUrl}/fields/descriptor`, { descriptor }).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Field'))
    );
  }

  archiveDescriptor(descriptor: FieldDescriptor) {
    return this.http.delete<FieldDescriptor[]>(`${environment.baseUrl}/fields/descriptor/${descriptor.id}`).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Field'))
    );
  }

  getFieldDescriptorClasses(): Observable<FieldDescriptorClass[]> {
    return this.http.get<FieldDescriptorClass[]>(`${environment.baseUrl}/fields/classes`).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Field'))
    );
  }

  addUpdateFieldValue(value_sets: FieldValue[]): Observable<StatusMessage> {
    return this.http.patch<StatusMessage>(`${environment.baseUrl}/field-value`, { value_sets }).pipe(
      retryWithBackoff(),
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Field'))
    );
  }
}
