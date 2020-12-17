import { Injectable } from '@angular/core';
import { ErrorService } from './error.service';
import { Subject, Observable } from 'rxjs';
import {
  StarSystem,
  Planet,
  Moon,
  SystemObject,
  Settlement,
  SystemImage,
  SystemLocation,
  SystemMapTypes
} from '../models/system-map.model';
import { tap, catchError } from 'rxjs/operators';
import { StatusMessage } from '../models/misc.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retryWithBackoff } from '../helpers/retryWithBackoff.helper';

@Injectable({
  providedIn: 'root'
})
export class SystemMapService {

  constructor(private http: HttpClient, private errorService: ErrorService) { }

  private dataRefreshSource = new Subject();
  private fullDataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  fullDataRefreshAnnounced$ = this.fullDataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log('System Map service data refresh called!');
    this.dataRefreshSource.next();
  }

  fullRefreshData() {
    this.fullDataRefreshSource.next();
  }

  list(): Observable<StarSystem[]> {
    return this.http.get<StarSystem[]>(`${environment.baseUrl}/system-map`).pipe(
      retryWithBackoff(),
      tap(result => {
        console.log(`Fetched ${result.length} star systems!`);
        console.log(result);
      }),
      catchError(this.errorService.handleError('Fetch System Map', []))
    );
  }

  addSystem(system: StarSystem): Observable<StarSystem>
  {
    return this.http.post<StarSystem>(`${environment.baseUrl}/system-map`, { system }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Created system!`)),
      catchError(this.errorService.handleError<any>('Create System'))
    );
  }

  updateSystem(system: StarSystem): Observable<StarSystem>
  {
    // system.jurisdiction_id = Number(`${system.jurisdiction_id}`)

    return this.http.put<StarSystem>(`${environment.baseUrl}/system-map`, { system }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Updated system!`)),
      catchError(this.errorService.handleError<any>('Update System'))
    );
  }

  archiveSystem(): Observable<StatusMessage>
  {
    throw new Error("Not available!")
  }

  addPlanet(planet: Planet): Observable<Planet>
  {
    return this.http.post<Planet>(`${environment.baseUrl}/system-map/planet`, { planet }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Created planet!`)),
      catchError(this.errorService.handleError<any>('Create Planet'))
    );
  }

  updatePlanet(planet: Planet): Observable<Planet>
  {
    return this.http.patch<Planet>(`${environment.baseUrl}/system-map/planet`, { planet }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Updated planet!`)),
      catchError(this.errorService.handleError<any>('Update Planet'))
    );
  }

  archivePlanet(planet: Planet): Observable<Planet>
  {
    return this.http.delete<Planet>(`${environment.baseUrl}/system-map/planet/${planet.id}`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Archived planet!`)),
      catchError(this.errorService.handleError<any>('Archive Planet'))
    );
  }

  addMoon(moon: Moon): Observable<Moon>
  {
    return this.http.post<Moon>(`${environment.baseUrl}/system-map/moon`, { moon }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Created moon!`)),
      catchError(this.errorService.handleError<any>('Create Planet'))
    );
  }

  updateMoon(moon: Moon): Observable<Moon>
  {
    return this.http.patch<Moon>(`${environment.baseUrl}/system-map/moon`, { moon }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Updated moon!`)),
      catchError(this.errorService.handleError<any>('Update Moon'))
    );
  }

  archiveMoon(moon: Moon): Observable<Moon>
  {
    return this.http.delete<Moon>(`${environment.baseUrl}/system-map/moon/${moon.id}`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Archived moon!`)),
      catchError(this.errorService.handleError<any>('Archive Moon'))
    );
  }

  addSystemObject(system_object: SystemObject): Observable<SystemObject>
  {
    return this.http.post<SystemObject>(`${environment.baseUrl}/system-map/system-object`, { system_object }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Created system object!`)),
      catchError(this.errorService.handleError<any>('Create System Object'))
    );
  }

  updateSystemObject(system_object: SystemObject): Observable<SystemObject>
  {
    return this.http.patch<SystemObject>(`${environment.baseUrl}/system-map/system-object`, { system_object }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Updated system object!`)),
      catchError(this.errorService.handleError<any>('Update System Object'))
    );
  }

  archiveSystemObject(system_object: SystemObject): Observable<SystemObject>
  {
    return this.http.delete<SystemObject>(`${environment.baseUrl}/system-map/system-object/${system_object.id}`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Archived system object!`)),
      catchError(this.errorService.handleError<any>('Archive System Object'))
    );
  }

  addSettlement(settlement: Settlement): Observable<Settlement>
  {
    return this.http.post<SystemObject>(`${environment.baseUrl}/system-map/settlement`, { settlement }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Created settlement!`)),
      catchError(this.errorService.handleError<any>('Create Settlement'))
    );
  }

  updateSettlement(settlement: Settlement): Observable<Settlement>
  {
    return this.http.patch<Settlement>(`${environment.baseUrl}/system-map/settlement`, { settlement }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Updated settlement!`)),
      catchError(this.errorService.handleError<any>('Update Settlement'))
    );
  }

  archiveSettlement(settlement: Settlement): Observable<Settlement>
  {
    return this.http.delete<Settlement>(`${environment.baseUrl}/system-map/settlement/${settlement.id}`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Archived settlement!`)),
      catchError(this.errorService.handleError<any>('Archive Settlement'))
    );
  }

  addSystemImage(image: SystemImage): Observable<SystemImage>
  {
    return this.http.post<SystemImage>(`${environment.baseUrl}/system-map/image`, { image }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Created image!`)),
      catchError(this.errorService.handleError<any>('Create Image'))
    );
  }

  updateSystemImage(image: SystemImage): Observable<SystemImage>
  {
    return this.http.patch<SystemImage>(`${environment.baseUrl}/system-map/image`, { image }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Updated image!`)),
      catchError(this.errorService.handleError<any>('Update Image'))
    );
  }

  archiveSystemImage(image: SystemImage): Observable<SystemImage>
  {
    return this.http.delete<SystemImage>(`${environment.baseUrl}/system-map/image/${image.id}`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Archived imgage!`)),
      catchError(this.errorService.handleError<any>('Archive Image'))
    );
  }

  addLocation(location: SystemLocation): Observable<SystemLocation>
  {
    return this.http.post<SystemLocation>(`${environment.baseUrl}/system-map/location`, { location }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Created location!`)),
      catchError(this.errorService.handleError<any>('Create Location'))
    );
  }

  updateLocation(location: SystemLocation): Observable<SystemLocation>
  {
    return this.http.patch<SystemLocation>(`${environment.baseUrl}/system-map/location`, { location }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Updated location!`)),
      catchError(this.errorService.handleError<any>('Update Location'))
    );
  }

  archiveLocation(location: SystemLocation): Observable<SystemLocation>
  {
    return this.http.delete<SystemLocation>(`${environment.baseUrl}/system-map/location/${location.id}`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Archived location!`)),
      catchError(this.errorService.handleError<any>('Archive Location'))
    );
  }

  addFlora()
  {
    throw new Error("Not available!")
  }

  updateFlora()
  {
    throw new Error("Not available!")
  }

  archiveFlora()
  {
    throw new Error("Not available!")
  }

  addFauna()
  {
    throw new Error("Not available!")
  }

  updateFauna()
  {
    throw new Error("Not available!")
  }

  archiveFauna()
  {
    throw new Error("Not available!")
  }

  fetch_types(): Observable<SystemMapTypes>
  {
    return this.http.get<SystemMapTypes>(`${environment.baseUrl}/system-map/types`).pipe(
      retryWithBackoff(),
      tap(results => console.log('Fetched System Map Types')),
      catchError(this.errorService.handleError<any>('Fetch System Map Types'))
    );
  }
}
