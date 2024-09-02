package com.quarkbs.FlightSearch.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class fareDetailsBySegment {
    private String segmentId;
    private String cabin;
    private String clase;
    private List<Amenities> amenities;

    @JsonCreator
    public fareDetailsBySegment(
            @JsonProperty("segmentId") String segmentId,
            @JsonProperty("cabin") String cabin,
            @JsonProperty("class") String clase,
            @JsonProperty("amenities") List<Amenities> amenities) {
        this.segmentId = segmentId;
        this.cabin = cabin;
        this.clase = clase;
        this.amenities = amenities;
    }

    public String getSegmentId() {
        return segmentId;
    }

    public void setSegmentId(String segmentId) {
        this.segmentId = segmentId;
    }

    public String getCabin() {
        return cabin;
    }

    public void setCabin(String cabin) {
        this.cabin = cabin;
    }

    public String getClase() {
        return clase;
    }

    public void setClase(String clase) {
        this.clase = clase;
    }

    public List<Amenities> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<Amenities> amenities) {
        this.amenities = amenities;
    }

}
