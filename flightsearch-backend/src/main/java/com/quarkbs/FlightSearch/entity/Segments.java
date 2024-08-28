package com.quarkbs.FlightSearch.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Segments {
    private Location departure;
    private Location arrival;
    private String carrierCode;
    private String duration;
    private int numberOfStops;
    private String number;
    private Aircraft aircraft;

    public Segments(
            @JsonProperty("departure") Location departure,
            @JsonProperty("arrival") Location arrival,
            @JsonProperty("duration") String duration,
            @JsonProperty("carrierCode") String carrierCode,
            @JsonProperty("numberOfStops") int numberOfStops,
            @JsonProperty("number") String number,
            @JsonProperty("aircraft") Aircraft aircraft) {
        this.departure = departure;
        this.arrival = arrival;
        this.duration = duration;
        this.carrierCode = carrierCode;
        this.numberOfStops = numberOfStops;
        this.number = number;
        this.aircraft = aircraft;
    }

    public Location getDeparture() {
        return departure;
    }

    public void setDeparture(Location departure) {
        this.departure = departure;
    }

    public Location getArrival() {
        return arrival;
    }

    public void setArrival(Location arrival) {
        this.arrival = arrival;
    }

    public String getCarrierCode() {
        return carrierCode;
    }

    public void setCarrierCode(String carrierCode) {
        this.carrierCode = carrierCode;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public int getNumberOfStops() {
        return numberOfStops;
    }

    public void setNumberOfStops(int numberOfStops) {
        this.numberOfStops = numberOfStops;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Aircraft getAircraft() {
        return aircraft;
    }

    public void setAircraft(Aircraft aircraft) {
        this.aircraft = aircraft;
    }

}
