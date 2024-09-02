package com.quarkbs.FlightSearch.entity;

import java.time.LocalDateTime;

public class Location {
    private String iataCode;
    private String terminal;
    private LocalDateTime at;

    public String getIataCode() {
        return iataCode;
    }

    public void setIataCode(String iataCode) {
        this.iataCode = iataCode;
    }

    public String getTerminal() {
        return terminal;
    }

    public void setTerminal(String terminal) {
        this.terminal = terminal;
    }

    public LocalDateTime getAt() {
        return at;
    }

    public void setAt(LocalDateTime at) {
        this.at = at;
    }

}
