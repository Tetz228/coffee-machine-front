import {TestBed} from '@angular/core/testing';

import {StatisticsService} from './statistics.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "../../config/app-config.service";
import {createSpyFromClass, Spy} from "jasmine-auto-spies";
import {Statistic} from "../models/statistic";

import {AppConfig} from "../../config/app-config";
import {ItemsParameters} from "../models/items-parameters";

/**
 * Тестирование сервиса для работы со статистикой.
 */
describe('StatisticsService', () => {
  let statisticsService: StatisticsService;
  let httpMock: HttpTestingController;
  let httpSpy: Spy<HttpClient>;
  let fakeAppConfigService = {getConfig: () => new AppConfig()};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatisticsService, {
        provide: HttpClient,
        useValue: createSpyFromClass(HttpClient)
      }]
    });

    httpSpy = TestBed.inject<any>(HttpClient);
    statisticsService = new StatisticsService(httpSpy, fakeAppConfigService as AppConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Тестирование метода на получение параметров статистик.
   */
  describe('getStatisticsParameters()', () => {
    it('should return statistics parameters', () => {
      let dummyStatisticsParameters: ItemsParameters<Statistic> = {
        items: [
          {
            id: 'fa6e894d-fdf2-4d24-af61-580f00721068',
            coffee: {
              id: '41af93a4-0bdf-47e2-b3c8-53d772a13788',
              name: 'Капучино',
              price: 900
            },
            total: 900
          },
          {
            id: '4hee894d-fdf2-4d24-14ng-580f00721068',
            coffee: {
              id: 'cafd8e82-c3a6-4edf-bbe4-e99bf900fc24',
              name: 'Американо',
              price: 500
            },
            total: 500
          }],
        totalCountItems: 2
      };

      httpSpy.get.and.nextWith(dummyStatisticsParameters);

      statisticsService.getStatisticsParameters("", 50, 1).subscribe(statisticsParameters =>
        expect(statisticsParameters).toEqual(dummyStatisticsParameters));

      expect(httpSpy.get.calls.count()).toBe(1);
    });
  });

  /**
   * Тестирование метода на получение параметров статистик с фильтрацией.
   */
  describe('getStatisticsParameters(filter)', () => {
    it('should return filtered statistics parameters', () => {
      let dummyStatisticsParameters: ItemsParameters<Statistic> = {
        items: [
          {
            id: 'fa6e894d-fdf2-4d24-af61-580f00721068',
            coffee: {
              id: '41af93a4-0bdf-47e2-b3c8-53d772a13788',
              name: 'Капучино',
              price: 900
            },
            total: 900
          }],
        totalCountItems: 1
      };

      httpSpy.get.and.nextWith(dummyStatisticsParameters);

      statisticsService.getStatisticsParameters("Капучино", 1, 50).subscribe(statisticsParameters =>
        expect(statisticsParameters).toEqual(dummyStatisticsParameters));

      expect(httpSpy.get.calls.count()).toBe(1);
    });
  });
});
