package com.quarkbs.FlightSearch.entity;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Dictionaries {
    private Map<String, String> carriers;

    @JsonCreator
    public Dictionaries(@JsonProperty("carriers") Map<String, String> carriers) {
        this.carriers = carriers;

    }

    public Map<String, String> getCarriers() {
        return carriers;
    }

    public void setCarriers(Map<String, String> carriers) {
        this.carriers = carriers;
    }

}
