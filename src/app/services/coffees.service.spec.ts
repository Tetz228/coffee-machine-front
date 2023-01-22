import {TestBed} from '@angular/core/testing';

import {CoffeesService} from './coffees.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "../../config/app-config.service";
import {createSpyFromClass, Spy} from "jasmine-auto-spies";
import {Coffee} from "../models/coffee";
import {ItemsParameters} from "../models/items-parameters";
import {AppConfig} from "../../config/app-config";

/**
 * Тестирование сервиса для работы с кофе.
 */
describe('CoffeesService', () => {
  let coffeesService: CoffeesService;
  let httpMock: HttpTestingController;
  let httpSpy: Spy<HttpClient>;
  let fakeAppConfigService = {getConfig: () => new AppConfig()};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoffeesService, AppConfigService, {
        provide: HttpClient,
        useValue: createSpyFromClass(HttpClient)
      }
      ]
    });

    httpSpy = TestBed.inject<any>(HttpClient);
    coffeesService = new CoffeesService(httpSpy, fakeAppConfigService as AppConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Тестирование метода на получение параметров видов кофе.
   */
  describe('getCoffeesParameters()', () => {
    it('should return coffees parameters', () => {
      let dummyCoffeesParameters: ItemsParameters<Coffee> = {
        items: [
          {
            id: 'cafd8e82-c3a6-4edf-bbe4-e99bf900fc24',
            name: 'Американо',
            price: 500
          },
          {
            id: '41af93a4-0bdf-47e2-b3c8-53d772a13788',
            name: 'Капучино',
            price: 900
          },
          {
            id: 'addb0a78-412e-47fa-9b79-7364331bddfb',
            name: 'Латте',
            price: 900
          }],
        totalCountItems: 3
      };

      httpSpy.get.and.nextWith(dummyCoffeesParameters);

      coffeesService.getCoffeesParameters("", 50, 1).subscribe(coffeesParameters =>
        expect(coffeesParameters).toEqual(dummyCoffeesParameters));

      expect(httpSpy.get.calls.count()).toBe(1);
    });
  });

  /**
   * Тестирование метода на получение параметров видов кофе с фильтрацией.
   */
  describe('getCoffeesParameters(filter)', () => {
    it('should return filtered coffees parameters', () => {
      let dummyCoffeesParameters: ItemsParameters<Coffee> = {
        items: [
          {
            id: 'cafd8e82-c3a6-4edf-bbe4-e99bf900fc24',
            name: 'Американо',
            price: 500
          }],
        totalCountItems: 1
      };

      httpSpy.get.and.nextWith(dummyCoffeesParameters);

      coffeesService.getCoffeesParameters("Американо", 1, 50).subscribe(coffeesParameters =>
        expect(coffeesParameters).toEqual(dummyCoffeesParameters));

      expect(httpSpy.get.calls.count()).toBe(1);
    });
  });
});
