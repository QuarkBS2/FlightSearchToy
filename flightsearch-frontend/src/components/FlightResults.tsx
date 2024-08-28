import { Spin, Button, Form, Checkbox, Descriptions, List, Card, Drawer, Row, Col } from "antd"
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface FlightData {
  id: string;
  itineraries: {
    duration: string;
    segments: {
      departure: {
        iataCode: string;
        terminal: string | null;
        at: string;
      }
      arrival: {
        iataCode: string;
        terminal: string | null;
        at: string;
      }
      number: string;
      carrierCode: string;
      numberOfStops: number;
      duration: string;
      aircraft: {
        code: string;
      };
    }[];
  }[];
  price: {
    currency: string;
    base: string;
    total: string;
    fees: {
      amount: string;
      type: string;
    }[]
  };
  travelerPricings: {
    travelerId: string;
    fareDetailsBySegment: {
      cabin: string;
      class: string;
      segmentId: string;
      Amenities: {
        description: string;
        isChargeable: boolean;
      }[];
    }[];
    price: {
      currency: string;
      base: string;
      total: string;
    };
  }[];
}

interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

const FlightResults: React.FC = () => {

  const [data, setData] = useState<FlightData[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const formParams = location.state;
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FlightData>();

  const showDrawer = (flight: FlightData) => {
    setSelectedItem(flight);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const timeFormat = (timePT: string) => {
    return timePT
      .replace('PT', '')
      .replace('H', ' h ')
      .replace('M', ' m ');
  }

  const dateFormat = (date: string) => {
    return date
      .replace('T', ' ');
  }

  const fetchFlightResults = async () => {
    if (!formParams) {
      navigate('/');
    }

    const params = new URLSearchParams();
    if (formParams.departureCode) {
      params.append('departureAirportCode', formParams.departureCode)
    }
    if (formParams.arrivalCode) {
      params.append('arrivalAirportCode', formParams.arrivalCode)
    }
    if (formParams.departureDate) {
      params.append('departureDate', formParams.departureDate)
    }
    if (formParams.arrivalDate) {
      params.append('arrivalDate', formParams.arrivalDate)
    }
    if (formParams.numberOfAdults) {
      params.append('numberAdults', formParams.numberOfAdults)
    }
    if (formParams.currency) {
      params.append('currency', formParams.currency)
    }
    formParams.nonStop === undefined ? params.append('hasStops', 'false') : params.append('hasStops', formParams.nonStop);

    try {
      const response = await axios.get(`http://localhost:8080/api/amadeus/flightsoffers?${params.toString()}`);
      setData(response.data);
    } catch (error) {
      console.log("Couldn't fetch the data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightResults();
  }, [formParams, navigate]);

  if (loading) {
    return (
      <div>
        <Spin size="large" tip="loading..." />
      </div>
    )
  }

  const onFinish = (values: any) => {

  };

  return (
    console.log(data),
    <>
      <Row>
        <Col span={12}>
          <Button onClick={() => { navigate('/') }} icon={<ArrowLeftOutlined />} style={{ margin: 12 }}>Return to search</Button>
        </Col>
        <Col span={12}>
          <Form layout="inline" style={{ margin: 12 }} onFinish={onFinish}>
            <Form.Item>
              <Checkbox defaultChecked={false}>Sort by date</Checkbox>
            </Form.Item>
            <Form.Item>
              <Checkbox defaultChecked={false}>Sort by price</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Apply sorting</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <List
        dataSource={data}
        renderItem={(flight) => (
          <List.Item >
            <Card
              title={`Flight ID: ${flight.id}`}
              actions={[
                <a onClick={() => showDrawer(flight)} key={`a-${flight}`}>
                  More details
                </a>
              ]}>
              {flight.itineraries.map((itinerary, itineraryIndex) =>
                <div key={itineraryIndex}>
                  <Descriptions bordered={true}>
                    <Descriptions.Item label="Flight trayectory">{`${itinerary.segments[0].departure.iataCode} --> ${itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}`}</Descriptions.Item>
                    <Descriptions.Item label="Time">{`${dateFormat(itinerary.segments[0].departure.at)} - ${dateFormat(itinerary.segments[itinerary.segments.length - 1].arrival.at)}`}</Descriptions.Item>
                    <Descriptions.Item label="Total duration">{timeFormat(itinerary.duration)}</Descriptions.Item>
                    <Descriptions.Item label="Total Price">{flight.price.total} {flight.price.currency}</Descriptions.Item>
                    <Descriptions.Item label="Price by traveler">{flight.travelerPricings[0].price.total} {flight.price.currency}</Descriptions.Item>
                  </Descriptions>
                  <Descriptions>
                    {itinerary.segments.map((segments, segmentsIndex) =>
                      <div key={segmentsIndex}>
                        <Descriptions title={`Segement ${segmentsIndex + 1}`} bordered={true}>
                          <Descriptions.Item label="Duration">{timeFormat(segments.duration)}</Descriptions.Item>
                          <Descriptions.Item label="Carrier Code">{segments.carrierCode}</Descriptions.Item>
                          <Descriptions.Item label="Departure Airport">{segments.departure.iataCode}</Descriptions.Item>
                          <Descriptions.Item label="Arrival Airport">{segments.arrival.iataCode}</Descriptions.Item>
                        </Descriptions>
                      </div>
                    )}
                  </Descriptions>
                </div>
              )}
            </Card>
          </List.Item>
        )}
      />

      <Drawer width={1240} placement="right" closable={false} onClose={onClose} open={open}>
        {selectedItem?.itineraries.map((itinerary, itineraryIndex) =>
          <div key={itineraryIndex}>
            <Row>
              <Card title="Flight details" style={{ marginBottom: 12 }}>
                <Descriptions>
                  <Descriptions.Item label="Flight trayectory">{`${itinerary.segments[0].departure.iataCode} --> ${itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}`}</Descriptions.Item>
                  <Descriptions.Item label="Time">{`${dateFormat(itinerary.segments[0].departure.at)} - ${dateFormat(itinerary.segments[itinerary.segments.length - 1].arrival.at)}`}</Descriptions.Item>
                  <Descriptions.Item label="Total duration">{timeFormat(itinerary.duration)}</Descriptions.Item>
                  <Descriptions.Item label="Total price">{`${selectedItem.price.total} ${selectedItem.price.currency}`}</Descriptions.Item>
                  <Descriptions.Item label="Price by traveler">{`${selectedItem.travelerPricings[0].price.total} ${selectedItem.price.currency}`}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Row>
            <Row>
              {itinerary.segments.map((segments, segmentsIndex) =>
                <div key={segmentsIndex}>
                  <Card title={`Segement ${segmentsIndex + 1}`} style={{ marginBottom: 12 }}>
                    <Col>
                      <Descriptions>
                        <Descriptions.Item label="Departure Time">{dateFormat(segments.departure.at)}</Descriptions.Item>
                        <Descriptions.Item label="Arrival Time">{dateFormat(segments.arrival.at)}</Descriptions.Item>
                        <Descriptions.Item label="Duration">{timeFormat(segments.duration)}</Descriptions.Item>
                        <Descriptions.Item label="Departure Airport">{segments.departure.iataCode}</Descriptions.Item>
                        <Descriptions.Item label="Arrival Airport">{segments.arrival.iataCode}</Descriptions.Item>
                        <Descriptions.Item label="Carrier Code">{segments.carrierCode}</Descriptions.Item>
                        <Descriptions.Item label="Flight Number">{segments.number}</Descriptions.Item>
                        <Descriptions.Item label="Aircraft Type">{segments.aircraft.code}</Descriptions.Item>
                      </Descriptions>
                    </Col>
                    <Col>
                      <Card title="Travelers fare details" style={{ marginTop: 8 }}>
                        <Descriptions>
                          <Descriptions.Item label="Cabin">{selectedItem.travelerPricings[0].fareDetailsBySegment[segmentsIndex].cabin}</Descriptions.Item>
                          <Descriptions.Item label="Class">{selectedItem.travelerPricings[0].fareDetailsBySegment[segmentsIndex].class}</Descriptions.Item>
                        </Descriptions>
                        <Row>
                          <p className="site-description-item-profile-p">Amenities:</p>
                          {selectedItem.travelerPricings[0].fareDetailsBySegment[segmentsIndex].Amenities.map((amenities, amenitiesIndex) =>
                            <div key={amenitiesIndex}>
                              <Descriptions>
                                <Descriptions.Item label="Description">{amenities.description}</Descriptions.Item>
                                <Descriptions.Item label="Is chargeable?">{amenities.isChargeable.toString()}</Descriptions.Item>
                              </Descriptions>
                            </div>
                          )}
                        </Row>
                      </Card>
                    </Col>
                  </Card>
                </div>
              )}
            </Row>
            <Card title="Price breakdown" style={{ marginBottom: 12 }}>
              <Descriptions>
                <Descriptions.Item label="Total Price">{selectedItem.price.base} {selectedItem.price.currency}</Descriptions.Item>
                <Descriptions.Item label="Total Price">{selectedItem.price.total} {selectedItem.price.currency}</Descriptions.Item>
                <Descriptions.Item label="Price by traveler">{selectedItem.travelerPricings[0].price.total} {selectedItem.price.currency}</Descriptions.Item>
              </Descriptions>
              <Row>
                <Col span={12}>
                  <p className="site-description-item-profile-p">Fees:</p>
                  {selectedItem.price.fees ? selectedItem.price.fees.map((fees, feesIndex) =>
                    <div key={feesIndex}>
                      <Row>
                        <Descriptions>
                          <Descriptions.Item label={`${fees.type}`}>{`${fees.amount} ${selectedItem.price.currency}`}</Descriptions.Item>
                        </Descriptions>
                      </Row>
                    </div>
                  ) : null}
                </Col>
              </Row>

            </Card>
          </div>
        )}
      </Drawer>

    </>
  )
}

export default FlightResults