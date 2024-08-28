package com.quarkbs.FlightSearch.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Itineraries {
    public String duration;
    public List<Segments> segments;

    @JsonCreator
    public Itineraries(@JsonProperty("duration") String duration, @JsonProperty("segments") List<Segments> segments) {
        this.duration = duration;
        this.segments = segments;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public List<Segments> getSegments() {
        return segments;
    }

    public void setSegments(List<Segments> segments) {
        this.segments = segments;
    }

}
