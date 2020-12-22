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
  SystemMapTypes,
  GravityWell,
  JumpPoint,
  MissionGiver,
  SystemMapSearchItem
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

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

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

  fullRefreshData()
  {
    this.fullDataRefreshSource.next();
  }

  fetchViewSelection(): number {
    const smv = localStorage.getItem('system-map-view-selection');
    if (smv) {
      return parseInt(smv, null);
    } else {
      localStorage.setItem('system-map-view-selection', '1');
      return 1;
    }
  }

  setViewSelection(viewSelection: number) {
    localStorage.setItem('system-map-view-selection', viewSelection.toString());
  }

  addRecentSelectedListItems(item: SystemMapSearchItem): SystemMapSearchItem[] {
    // get all the current items
    let recents = this.recentSelectedListItems() || [];
    // push the new one
    recents.push(item);

    // make sure all of the items are unique
    const uniqResults = [];
    const map = new Map();
    for (const itemInner of recents.reverse()) {
      if (!map.has(itemInner.id)){
          map.set(itemInner.id, true);    // set any value to Map
          uniqResults.push(itemInner);
        }
    }

    recents = uniqResults;

    // make sure we only have six
    if (recents.length > 5) {
      const trimLength = recents.length - 5;
      recents.splice(0, Math.abs(trimLength));
    }

    // set the new list
    localStorage.setItem('system-map-view-recent-items', JSON.stringify(recents));

    // return the revised list
    return recents;
  }

  recentSelectedListItems(): SystemMapSearchItem[] {
    const recents = JSON.parse(localStorage.getItem('system-map-view-recent-items')) as SystemMapSearchItem[];
    return recents;
  }

  clearRecentSelectedListItems(): [] {
    localStorage.removeItem('system-map-view-recent-items');
    return [];
  }

  /**
   * Fetch a deep object list from System Map. Use of this is generally deprecated. It mainly exists for legacy use and will be deprecated.
   */
  listDeep(): Observable<StarSystem[]> {
    return this.http.get<StarSystem[]>(`${environment.baseUrl}/system-map`).pipe(
      retryWithBackoff(),
      retryWithBackoff(),
      tap(result => {
        console.log(`Fetched ${result.length} star systems!`);
        console.log(result);
      }),
      catchError(this.errorService.handleError('Fetch System Map', []))
    );
  }

  /**
   * List all current star systems.
   */
  listSystems(): Observable<StarSystem[]>
  {
    return this.http.get<StarSystem[]>(`${environment.baseUrl}/system-map`).pipe(
      retryWithBackoff(),
      tap(result => {
        console.log(`Fetched ${result.length} star systems!`);
        console.log(result);
      }),
      catchError(this.errorService.handleError('Fetch System Map', []))
    );
  }

  listSystemsWithDetails(): Observable<StarSystem[]>
  {
    return this.http.get<StarSystem[]>(`${environment.baseUrl}/system-map/details`).pipe(
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

  archiveSystem(system: StarSystem): Observable<StatusMessage>
  {
    return this.http.delete<StatusMessage>(`${environment.baseUrl}/system-map/${system.id}`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Archived system!`)),
      catchError(this.errorService.handleError<any>('Archive System'))
    );
  }

  listGravityWells() {

  }

  addGravityWell() {

  }

  updateGravityWell(gravity_well: GravityWell): Observable<GravityWell> {
    return this.http.put<GravityWell>(`${environment.baseUrl}/system-map/gravity-well`, { gravity_well }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Updated gravity well!`)),
      catchError(this.errorService.handleError<any>('Update Gravity Well'))
    );
  }

  archiveGravityWell() {

  }

  listPlanets(): Observable<Planet[]> {
    return this.http.get<Planet[]>(`${environment.baseUrl}/system-map/planet`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Fetched ${result.length} planets!`)),
      catchError(this.errorService.handleError<any>('List Planets'))
    );
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
    return this.http.put<Planet>(`${environment.baseUrl}/system-map/planet`, { planet }).pipe(
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

  listMoons(): Observable<Moon[]> {
    return this.http.get<Moon[]>(`${environment.baseUrl}/system-map/moon`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Fetched ${result.length} moons!`)),
      catchError(this.errorService.handleError<any>('List Moons'))
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
    return this.http.put<Moon>(`${environment.baseUrl}/system-map/moon`, { moon }).pipe(
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

  listSystemObjects(): Observable<SystemObject[]> {
    return this.http.get<SystemObject[]>(`${environment.baseUrl}/system-map/system-object`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Fetched ${result.length} system objects!`)),
      catchError(this.errorService.handleError<any>('List Settlements'))
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
    return this.http.put<SystemObject>(`${environment.baseUrl}/system-map/system-object`, { system_object }).pipe(
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

  listSettlements(): Observable<Settlement[]> {
    return this.http.get<Settlement[]>(`${environment.baseUrl}/system-map/settlement`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`List Settlements`)),
      catchError(this.errorService.handleError<any>('List Settlements'))
    );
  }

  addSettlement(settlement: Settlement): Observable<Settlement>
  {
    return this.http.post<Settlement>(`${environment.baseUrl}/system-map/settlement`, { settlement }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Created settlement!`)),
      catchError(this.errorService.handleError<any>('Create Settlement'))
    );
  }

  updateSettlement(settlement: Settlement): Observable<Settlement>
  {
    return this.http.put<Settlement>(`${environment.baseUrl}/system-map/settlement`, { settlement }).pipe(
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
    return this.http.put<SystemImage>(`${environment.baseUrl}/system-map/image`, { image }).pipe(
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

  listLocations(): Observable<SystemLocation[]> {
    return this.http.get<SystemLocation[]>(`${environment.baseUrl}/system-map/location`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Fetched ${result.length} locations!`)),
      catchError(this.errorService.handleError<any>('List Locations'))
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
    return this.http.put<SystemLocation>(`${environment.baseUrl}/system-map/location`, { location }).pipe(
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

  listMissionGivers(): Observable<MissionGiver[]> {
    return this.http.get<MissionGiver[]>(`${environment.baseUrl}/system-map/mission-giver`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Fetched ${result.length} mission givers!`)),
      catchError(this.errorService.handleError<any>('Create Mission Giver'))
    );
  }

  getMissionGiver(mission_giver_id: string): Observable<MissionGiver[]> {
    return this.http.get<MissionGiver>(`${environment.baseUrl}/system-map/mission-giver/${mission_giver_id}`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Created mission giver!`)),
      catchError(this.errorService.handleError<any>('Create Mission Giver'))
    );
  }

  addMissionGiver(mission_giver: MissionGiver): Observable<MissionGiver>
  {
    return this.http.post<MissionGiver>(`${environment.baseUrl}/system-map/mission-giver`, { mission_giver }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Created mission giver!`)),
      catchError(this.errorService.handleError<any>('Create Mission Giver'))
    );
  }

  updateMissionGiver(mission_giver: MissionGiver): Observable<MissionGiver>
  {
    return this.http.put<MissionGiver>(`${environment.baseUrl}/system-map/mission-giver`, { mission_giver }).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Updated mission giver!`)),
      catchError(this.errorService.handleError<any>('Update Mission Giver'))
    );
  }

  archiveMissionGiver(mission_giver: MissionGiver): Observable<MissionGiver>
  {
    return this.http.delete<StatusMessage>(`${environment.baseUrl}/system-map/mission-giver/${mission_giver.id}`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Archived mission giver!`)),
      catchError(this.errorService.handleError<any>('Archive Mission Giver'))
    );
  }

  addFlora()
  {
    throw new Error('Not available!');
  }

  updateFlora()
  {
    throw new Error('Not available!');
  }

  archiveFlora()
  {
    throw new Error('Not available!');
  }

  addFauna()
  {
    throw new Error('Not available!');
  }

  updateFauna()
  {
    throw new Error('Not available!');
  }

  archiveFauna()
  {
    throw new Error('Not available!');
  }

  listJumpPoints(): Observable<JumpPoint[]> {
    return this.http.get<JumpPoint[]>(`${environment.baseUrl}/system-map/jump-point`).pipe(
      retryWithBackoff(),
      tap(result => console.log(`Fetched ${result.length} jump points!`)),
      catchError(this.errorService.handleError<any>('List Jump Points'))
    );
  }

  addJumpPoint(jump_point: JumpPoint): Observable<JumpPoint>
  {
    return this.http.post<JumpPoint>(`${environment.baseUrl}/system-map/jump-point`, { jump_point }).pipe(
      retryWithBackoff(),
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Create Jump Point'))
    );
  }

  updateJumpPoint(jump_point: JumpPoint): Observable<JumpPoint>
  {
    return this.http.put<JumpPoint>(`${environment.baseUrl}/system-map/jump-point`, { jump_point }).pipe(
      retryWithBackoff(),
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Update Jump Point'))
    );
  }

  archiveJumpPoint(jump_point: JumpPoint): Observable<JumpPoint>
  {
    return this.http.delete<StatusMessage>(`${environment.baseUrl}/system-map/jump-point/${jump_point.id}`).pipe(
      retryWithBackoff(),
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Archive Jump Point'))
    );
  }

  // fetch_types() : Observable<SystemMapTypes>
  // {
  //   return this.http.get<SystemMapTypes>(`${environment.baseUrl}/system-map/types`).pipe(
      // retryWithBackoff(),
  //     tap(results => console.log("Fetched System Map Types")),
  //     catchError(this.errorService.handleError<any>('Fetch System Map Types'))
  //   )
  // }
}
