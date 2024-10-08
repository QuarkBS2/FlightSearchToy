package com.quarkbs.FlightSearch.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Amenities {

    private String description;
    private Boolean isChargeable;

    @JsonCreator
    public Amenities(@JsonProperty("description") String description,
            @JsonProperty("isChargeable") Boolean isChargeable) {
        this.description = description;
        this.isChargeable = isChargeable;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsChargeable() {
        return isChargeable;
    }

    public void setIsChargeable(Boolean isChargeable) {
        this.isChargeable = isChargeable;
    }

}
