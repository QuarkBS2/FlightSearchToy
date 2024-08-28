package com.quarkbs.FlightSearch.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quarkbs.FlightSearch.entity.FlightsOffersDTO;
import com.quarkbs.FlightSearch.service.AmadeusService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/amadeus")
public class AmadeusController {
    private final AmadeusService amadeusService;

    public AmadeusController(AmadeusService amadeusService) {
        this.amadeusService = amadeusService;
    }

    @GetMapping("/airports")
    public ResponseEntity<String> getAirports(
            @RequestParam(defaultValue = "CITY,AIRPORT") String subType,
            @RequestParam(defaultValue = "") String keyword) {
        String response = amadeusService.getAirports(subType, keyword);
        return ResponseEntity.ok(response);

    }

    @GetMapping("/flightsoffers")
    public ResponseEntity<List<FlightsOffersDTO>> getFlightsOffers(
            @RequestParam String departureAirportCode,
            @RequestParam String arrivalAirportCode,
            @RequestParam String departureDate,
            @RequestParam(required = false) String returnDate,
            @RequestParam int numberAdults,
            @RequestParam String currency,
            @RequestParam Boolean hasStops) {
        List<FlightsOffersDTO> response = amadeusService.getFlights(departureAirportCode, arrivalAirportCode,
                departureDate, returnDate, numberAdults, currency, hasStops);
        return ResponseEntity.ok(response);
    }

}
