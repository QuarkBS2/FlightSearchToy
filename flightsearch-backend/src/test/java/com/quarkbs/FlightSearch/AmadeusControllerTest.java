package com.quarkbs.FlightSearch;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.quarkbs.FlightSearch.controller.AmadeusController;
import com.quarkbs.FlightSearch.service.AmadeusService;

@ExtendWith(MockitoExtension.class)
public class AmadeusControllerTest {

    @Mock
    private AmadeusService amadeusService;

    @InjectMocks
    private AmadeusController amadeusController;

    @BeforeEach
    public void setUp() {
        amadeusController = new AmadeusController(amadeusService);
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
        String subType = "CITY,AIRPORT";
        String keyword = "BOS";

        when(amadeusService.getAirports(anyString(), anyString())).thenReturn(expectedBody);

        ResponseEntity<String> response = amadeusController.getAirports(subType, keyword);

        response.getBody();

        assertEquals(expectedBody, response.getBody());

    }

    @Test
    public void testaGetFlightsOffers() {
        // Yet to be implemented.
        // String departureAirportCode = "BOS";
        // String arrivalAirportCode = "CDG";
        // String departureDate = "2024-09-06";
        // String returnDate = "2024-09-06";
        // int numberAdults = 2;
        // String currency = "MXN";
        // Boolean hasStops = false;
        // String sortBy = "price";
        // String orderBy = "asc";
        // int page = 1;
        // List<FlightsOffersDTO> flightOffers;
        // when(amadeusService.getFlights(anyString(), anyString(),anyString(),
        // anyString(), anyInt(), anyString(), anyBoolean())).thenReturn(flightOffers);
        // when(amadeusService.sortFlights(flightOffers, sortBy,
        // orderBy)).thenReturn(flightOffers);
        // when(amadeusService.pagination(flightOffers, page)).thenReturn(flightOffers);

        // ResponseEntity<Map<String, Object>> responseFlights =
        // amadeusController.getFlightsOffers(departureAirportCode, arrivalAirportCode,
        // departureDate, returnDate, numberAdults, currency, hasStops, sortBy, orderBy,
        // page);

    }
}