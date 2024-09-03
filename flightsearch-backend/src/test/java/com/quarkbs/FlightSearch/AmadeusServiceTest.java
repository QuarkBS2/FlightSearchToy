package com.quarkbs.FlightSearch;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.quarkbs.FlightSearch.service.AmadeusService;

@ExtendWith(MockitoExtension.class)
public class AmadeusServiceTest {

    @Mock
    private RestTemplateBuilder restTemplateBuilder;

    @Mock
    private RestTemplate restTemplate;

    private AmadeusService amadeusService;

    @BeforeEach
    public void setUp() {
        when(restTemplateBuilder.build()).thenReturn(restTemplate);
        amadeusService = new AmadeusService(restTemplateBuilder);
    }

    @Test
    public void testAuth() {
        String mockedToken = "mocked_access_token";
        Map<String, String> mockResponse = new HashMap<>();
        mockResponse.put("access_token", mockedToken);

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(), eq(Map.class))).thenReturn(responseEntity);
        String accessToken = amadeusService.authenticate();

        assertEquals(mockedToken, accessToken);

    }

    @Test
    public void testGetAirports() {
        String expectedBody = """
                {
                    "meta": {
                        "links": {
                            "self": "https://test.api.amadeus.com/v1/reference-data/locations/CMUC"
                        }
                    },
                    "data": {
                        "type": "location",
                        "subType": "CITY",
                        "name": "MUNICH INTERNATIONAL",
                        "detailedName": "MUNICH/DE:MUNICH INTERNATIONAL",
                        "id": "CMUC",
                        "self": {
                            "href": "https://test.api.amadeus.com/v1/reference-data/locations/CMUC",
                            "methods": [
                                "GET"
                            ]
                        },
                        "timeZoneOffset": "+02:00",
                        "iataCode": "MUC",
                        "geoCode": {
                            "latitude": 48.35378,
                            "longitude": 11.78609
                        },
                        "address": {
                            "cityName": "MUNICH",
                            "cityCode": "MUC",
                            "countryName": "GERMANY",
                            "countryCode": "DE",
                            "regionCode": "EUROP"
                        },
                        "analytics": {
                            "travelers": {
                                "score": 27
                            }
                        }
                    }
                }""";
        String subType = "AIRPORT";
        String keyword = "BOS";
        String mockedToken = "mocked_access_token";

        Map<String, String> mockResponse = new HashMap<>();
        mockResponse.put("access_token", mockedToken);
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(), eq(Map.class))).thenReturn(responseEntity);

        ResponseEntity<String> resultEntity = new ResponseEntity<>(expectedBody, HttpStatus.OK);
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenReturn(resultEntity);

        String response = amadeusService.getAirports(subType, keyword);
        assertEquals(expectedBody, response);

    }

    @Test
    public void testGetFlights() {
        //Yet to be finished. Fails at current state
        Map<String, Object> departure = new HashMap<>();
        departure.put("iataCode", "BOS");
        departure.put("terminal", "0");
        departure.put("at", "2024-09-02T07:00:00");

        Map<String, Object> arrival = new HashMap<>();
        arrival.put("iataCode", "PAR");
        arrival.put("terminal", "0");
        arrival.put("at", "2024-09-02T17:00:00");

        Map<String, Object> segment = new HashMap<>();
        segment.put("departure", departure);
        segment.put("arrival", arrival);
        segment.put("carrierCode", "OD");
        segment.put("number", "104");
        segment.put("aircraft", Map.of("code", "777"));
        segment.put("duration", "PT50H0M");

        Map<String, Object> itinerary = new HashMap<>();
        itinerary.put("duration", "PT10H0M");
        itinerary.put("segments", List.of(segment));

        Map<String, Object> flightOffer = new HashMap<>();
        flightOffer.put("id", "1");
        flightOffer.put("source", "BOS");
        flightOffer.put("type", "flight-offer");
        flightOffer.put("itineraries", itinerary);

        Map<String, Object> expectedBody = new HashMap<>();
        expectedBody.put("data", List.of(flightOffer));

        String departureAirportCode = "BOS";
        String arrivalAirportCode = "PAR";
        String departureDate = "2024-09-02";
        String returnDate = "2024-09-03";
        int numberAdults = 2;
        String currency = "MXN";
        Boolean hasStops = false;
        String mockedToken = "mocked_access_token";

        Map<String, String> mockResponse = new HashMap<>();
        mockResponse.put("access_token", mockedToken);
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(mockResponse, HttpStatus.OK);
        //when(restTemplate.postForEntity(anyString(), any(), eq(Map.class))).thenReturn(responseEntity);

        ResponseEntity<Map> resultEntity = new ResponseEntity<>(expectedBody, HttpStatus.OK);
        //when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(Map.class))).thenReturn(resultEntity);

        //List<FlightsOffersDTO> responseOffersDTO = amadeusService.getFlights(departureAirportCode, arrivalAirportCode, departureDate, returnDate, numberAdults, currency, hasStops);

    }

}