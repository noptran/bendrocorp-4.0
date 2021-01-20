import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MemberApplicationPage } from './member-application.page';

describe('MemberApplicationPage', () => {
  let component: MemberApplicationPage;
  let fixture: ComponentFixture<MemberApplicationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberApplicationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MemberApplicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
