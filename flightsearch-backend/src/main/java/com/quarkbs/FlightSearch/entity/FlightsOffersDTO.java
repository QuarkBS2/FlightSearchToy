package com.quarkbs.FlightSearch.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class FlightsOffersDTO {
    private String id;
    private List<Itineraries> itineraries;
    private Price price;
    private List<TravelerPricings> travelerPricings;
    private Dictionaries dictionaries;

    @JsonCreator
    public FlightsOffersDTO(@JsonProperty("id") String id, @JsonProperty("itineraries") List<Itineraries> itineraries,
            @JsonProperty("price") Price price,
            @JsonProperty("travelerPricings") List<TravelerPricings> travelerPricings,
            @JsonProperty("dictionaries") Dictionaries dictionaries) {
        this.id = id;
        this.itineraries = itineraries;
        this.price = price;
        this.travelerPricings = travelerPricings;
        this.dictionaries = dictionaries;

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<Itineraries> getItineraries() {
        return itineraries;
    }

    public void setItineraries(List<Itineraries> itineraries) {
        this.itineraries = itineraries;
    }

    public Price getPrice() {
        return price;
    }

    public void setPrice(Price price) {
        this.price = price;
    }

    public List<TravelerPricings> getTravelerPricings() {
        return travelerPricings;
    }

    public void setTravelerPricings(List<TravelerPricings> travelerPricings) {
        this.travelerPricings = travelerPricings;
    }

    public Float getTotalPrice() {
        return Float.valueOf(price.getTotal());
    }

    public Dictionaries getDictionaries() {
        return dictionaries;
    }

    public void setDictionaries(Dictionaries dictionaries) {
        this.dictionaries = dictionaries;
    }

}
