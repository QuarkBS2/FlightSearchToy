package com.quarkbs.FlightSearch.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TravelerPricings {
    private String travelerId;
    private Price price;
    private List<fareDetailsBySegment> fareDetailsBySegment;

    @JsonCreator
    public TravelerPricings(@JsonProperty("travelerId") String travelerId, @JsonProperty("price") Price price,
            @JsonProperty("fareDetailsBySegment") List<fareDetailsBySegment> fareDetailsBySegment) {
        this.travelerId = travelerId;
        this.price = price;
        this.fareDetailsBySegment = fareDetailsBySegment;
    }

    public String getTravelerId() {
        return travelerId;
    }

    public void setTravelerId(String travelerId) {
        this.travelerId = travelerId;
    }

    public Price getPrice() {
        return price;
    }

    public void setPrice(Price price) {
        this.price = price;
    }

    public List<fareDetailsBySegment> getFareDetailsBySegment() {
        return fareDetailsBySegment;
    }

    public void setFareDetailsBySegment(List<fareDetailsBySegment> fareDetailsBySegment) {
        this.fareDetailsBySegment = fareDetailsBySegment;
    }

}
