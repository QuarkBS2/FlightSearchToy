package com.quarkbs.FlightSearch.service;

import java.time.Duration;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.quarkbs.FlightSearch.entity.FlightsOffersDTO;
import com.quarkbs.FlightSearch.entity.Itineraries;

@Service
public class AmadeusService {
    @Value("${amadeus.api.base.url}")
    private String baseUrl;

    @Value("${amadeus.api.key}")
    private String apiKey;

    @Value("${amadeus.api.secret}")
    private String apiSecret;

    private final RestTemplate restTemplate;

    public AmadeusService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public String authenticate() {
        String url = "https://test.api.amadeus.com/v1/security/oauth2/token";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.set("grant_type", "client_credentials");
        body.set("client_id", apiKey);
        body.set("client_secret", apiSecret);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, String> responseBody = response.getBody();
            return responseBody != null ? responseBody.get("access_token") : null;
        }
        return null;
    }

    public String getAirports(String subType, String keyword) {
        String accessToken = authenticate();
        if (accessToken == null) {
            throw new RuntimeException("Failure to authenticate with the Amadeus API");
        }

        String url = baseUrl +
                "v1/reference-data/locations?subType=" +
                subType +
                "&keyword=" +
                keyword;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        }

        return null;
    }

    public List<FlightsOffersDTO> getFlights(String departureAirportCode, String arrivalAirportCode,
            String departureDate, String returnDate, int numberAdults, String currency, Boolean hasStops) {
        String accessToken = authenticate();
        if (accessToken == null) {
            throw new RuntimeException("Failure to authenticate with the Amadeus API");
        }

        String url = baseUrl +
                "v2/shopping/flight-offers?originLocationCode=" + departureAirportCode +
                "&destinationLocationCode=" + arrivalAirportCode +
                "&departureDate=" + departureDate +
                "&adults=" + numberAdults +
                "&nonStop=" + hasStops +
                "&currencyCode=" + currency;

        if (returnDate != null) {
            url += "&returnDate=" + returnDate;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> body = response.getBody();

            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            List<FlightsOffersDTO> flightsOffers = ((List<Map<String, Object>>) body.get("data")).stream()
                    .map(data -> mapper.convertValue(data, FlightsOffersDTO.class)).collect(Collectors.toList());

            return flightsOffers;
        }

        return null;
    }

    public List<FlightsOffersDTO> sortFlights(List<FlightsOffersDTO> flightOffers, String sortBy, String orderBy) {
        Comparator<FlightsOffersDTO> comparator;

        switch (sortBy) {
            case "price" -> comparator = Comparator.comparing(FlightsOffersDTO::getTotalPrice);
            case "duration" -> comparator = Comparator.comparing(flightOffer -> flightOffer.getItineraries().stream()
                    .map(Itineraries::getDurationAsObject).reduce(Duration.ZERO, Duration::plus));
            case "duration_price" -> comparator = Comparator
                    .comparing((FlightsOffersDTO flightOffer) -> flightOffer.getItineraries().stream()
                            .map(Itineraries::getDurationAsObject).reduce(Duration.ZERO, Duration::plus))
                    .thenComparing(FlightsOffersDTO::getTotalPrice);
            default -> throw new IllegalArgumentException("Invalid sort option: " + sortBy);
        }

        Collections.sort(flightOffers, comparator);
        if (orderBy.equals("desc")) {
            flightOffers = flightOffers.reversed();
        }

        return flightOffers;
    }

    public Map<String, Object> pagination(List<FlightsOffersDTO> flightsOffers, int page) {
        int size = 10;
        int flightSize = flightsOffers.size();
        int start = (page - 1) * size;
        int end = Math.min(start + size, flightSize);

        flightsOffers = flightsOffers.subList(start, end);

        Map<String, Object> result = new HashMap<>();
        result.put("data", flightsOffers);
        result.put("totalSize", flightSize);

        return result;
    }

}
