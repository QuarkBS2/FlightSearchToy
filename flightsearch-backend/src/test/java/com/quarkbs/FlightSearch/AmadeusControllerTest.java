package com.quarkbs.FlightSearch;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.quarkbs.FlightSearch.controller.AmadeusController;
import com.quarkbs.FlightSearch.service.AmadeusService;

@WebMvcTest(value = AmadeusController.class)
@ExtendWith(MockitoExtension.class)
public class AmadeusControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AmadeusService amadeusService;

    @Test
    public void testGetAirports() {
        // To be implemented

    }

    @Test
    public void testaGetFlightsOffers() {
        // To be implemented
    }
}