import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BendroSafeSearchResultComponent } from './bendro-safe-search-result.component';

describe('BendroSafeSearchResultComponent', () => {
  let component: BendroSafeSearchResultComponent;
  let fixture: ComponentFixture<BendroSafeSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BendroSafeSearchResultComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BendroSafeSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
