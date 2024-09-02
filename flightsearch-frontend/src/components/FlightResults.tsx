import { Flex, Spin, notification, Button, Form, Checkbox, Select, Descriptions, List, Card, Drawer, Row, Col, Typography } from "antd"
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

type NotificationType = 'success' | 'info' | 'warning' | 'error';
const { Text } = Typography;

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
      amenities: {
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
  dictionaries: {
    locations: {

    }[];
    carriers: {

    };
  }
}

const FlightResults: React.FC = () => {

  const [data, setData] = useState<FlightData[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const formParams = location.state;
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FlightData>();

  const openNotification = (type: NotificationType) => {
    api[type]({
      message: 'Fetching error',
      description:
        'Could not fetch the data from the server: Contact your administrator',
      showProgress: true,
      pauseOnHover: true,
    });
  };

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

  const calculateLayover = (arrivalTime: string, departureTime: string): string => {
    const arrivalDate = new Date(arrivalTime);
    const departureDate = new Date(departureTime);
    const diffMs = departureDate.getTime() - arrivalDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    return hours >= 0 ? `${hours}h ${minutes}m` : `0h 0m`;

  }

  const fetchFlightResults = async () => {
    try {
      const params = new URLSearchParams();
      if (formParams.sortBy !== undefined) {
        params.append('sortBy', formParams.sortBy);
      }
      if (formParams.orderBy !== undefined) {
        params.append('orderBy', formParams.orderBy);
      }
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
        openNotification('error');
        setData([])
      } finally {
        setLoading(false);
      }
    } catch (error) {
      if (formParams === null) {
        navigate('/');
      }
    }

  };

  useEffect(() => {
    fetchFlightResults();
  }, [formParams]);

  if (loading) {
    return (
      <Flex justify={'center'} align={'center'}>
        <Spin size="large" />
      </Flex>
    )
  }

  const onFinish = (values: any) => {
    if ((values.checkedPrice === undefined || !values.checkedPrice) || (values.checkedDuration === undefined || !values.checkedDuration)) {
      formParams.sortBy = undefined;
    }
    if (values.checkedDuration && values.checkedPrice) {
      formParams.sortBy = "duration_price";
    }
    if (values.checkedDuration && !values.checkedPrice) {
      formParams.sortBy = "duration";
    }
    if (!values.checkedDuration && values.checkedPrice) {
      formParams.sortBy = "price";
    }
    if (values.orderBy !== undefined && values.orderBy !== null) {
      formParams.orderBy = values.orderBy;
    }
    fetchFlightResults();
  };

  return (
    console.log(data),
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <Button onClick={() => { navigate('/') }} icon={<ArrowLeftOutlined />} style={{ margin: 12 }}>Return to search</Button>
        </Col>
        <Col span={12}>
          <Form layout="inline" style={{ margin: 12 }} onFinish={onFinish}>
            <Form.Item name='checkedDuration' valuePropName="checked">
              <Checkbox defaultChecked={false}>Sort by duration</Checkbox>
            </Form.Item>
            <Form.Item name='checkedPrice' valuePropName="checked">
              <Checkbox defaultChecked={false}>Sort by price</Checkbox>
            </Form.Item>
            <Form.Item name="orderBy" label="Order by">
              <Select defaultValue={"asc"}>
                <Select.Option value="asc">ASC</Select.Option>
                <Select.Option value="desc">DESC</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Apply sorting</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <List
        style={{ background: '#f8f8f8' }}
        dataSource={data}
        renderItem={(flight) => (
          <List.Item >
            <Card
              title={`Flight offer ${flight.id}`}
              style={{ width: 1600, marginLeft: 35 }}
              actions={[
                <a onClick={() => showDrawer(flight)} key={`a-${flight}`}>
                  More details
                </a>
              ]}>
              {flight.itineraries.map((itinerary, itineraryIndex) =>
                <div key={itineraryIndex}>
                  <Card style={{ marginBottom: 16 }}>
                    <Descriptions title={`${itineraryIndex === 0 ? "Go" : "Returing"} flight `} bordered={true}>
                      <Descriptions.Item label="Flight trayectory">{`${itinerary.segments[0].departure.iataCode} --> ${itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}`}</Descriptions.Item>
                      <Descriptions.Item label="Time">{`${dateFormat(itinerary.segments[0].departure.at)} - ${dateFormat(itinerary.segments[itinerary.segments.length - 1].arrival.at)}`}</Descriptions.Item>
                      <Descriptions.Item label="Total duration">{timeFormat(itinerary.duration)}</Descriptions.Item>
                      <Descriptions.Item label="Total Price">{flight.price.total} {flight.price.currency}</Descriptions.Item>
                      <Descriptions.Item label="Price by traveler">{flight.travelerPricings[0].price.total} {flight.price.currency}</Descriptions.Item>
                    </Descriptions>
                    {itinerary.segments.map((segments, segmentsIndex) =>
                      <div key={segmentsIndex} style={{marginTop: 12}}>
                        <Descriptions title={`Segement ${segmentsIndex + 1}`} bordered={true}>
                          <Descriptions.Item label="Duration">{timeFormat(segments.duration)}</Descriptions.Item>
                          <Descriptions.Item label="Carrier Code">{`${segments.carrierCode}`}</Descriptions.Item>
                          <Descriptions.Item label="Departure Airport">{segments.departure.iataCode}</Descriptions.Item>
                          <Descriptions.Item label="Arrival Airport">{segments.arrival.iataCode}</Descriptions.Item>
                        </Descriptions>
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </Card>
          </List.Item>
        )}
      />

      <Drawer width={1650} placement="right" closable={true} onClose={onClose} open={open} destroyOnClose style={{ background: '#f8f8f8' }}>
        {selectedItem?.itineraries.map((itinerary, itineraryIndex) =>
          <div key={itineraryIndex}>
            <Row>
              <Col span={12}>
                <Card title={`${itineraryIndex === 0 ? "Go" : "Returing"} flight `} style={{ marginBottom: 32 }}>
                  <Row>
                    <Card title="Basic details" style={{ marginBottom: 12 }}>
                      <Descriptions>
                        <Descriptions.Item label="Flight trayectory">{`${itinerary.segments[0].departure.iataCode} --> ${itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}`}</Descriptions.Item>
                        <Descriptions.Item label="Time">{`${dateFormat(itinerary.segments[0].departure.at)} - ${dateFormat(itinerary.segments[itinerary.segments.length - 1].arrival.at)}`}</Descriptions.Item>
                        <Descriptions.Item label="Total duration">{timeFormat(itinerary.duration)}</Descriptions.Item>
                        <Descriptions.Item label="Layover time">{calculateLayover(itinerary.segments[0].arrival.at, itinerary.segments[itinerary.segments.length - 1].departure.at)}</Descriptions.Item>
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
                              <Row style={{ marginTop: 12 }}>
                                <Text type="secondary">Amenities:</Text>
                                {selectedItem.travelerPricings[0].fareDetailsBySegment[segmentsIndex].amenities?.map((amenities, amenitiesIndex) =>
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
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Price breakdown" style={{ marginLeft: 12 }}>
                  <Descriptions>
                    <Descriptions.Item label="Base Price">{selectedItem.price.base} {selectedItem.price.currency}</Descriptions.Item>
                    <Descriptions.Item label="Total Price">{selectedItem.price.total} {selectedItem.price.currency}</Descriptions.Item>
                    <Descriptions.Item label="Price by traveler">{selectedItem.travelerPricings[0].price.total} {selectedItem.price.currency}</Descriptions.Item>
                  </Descriptions>
                  <Row style={{ marginTop: 12 }}>
                    <Col span={12}>
                      <Text type="secondary">Fees:</Text>
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
              </Col>
            </Row>
          </div>
        )}
      </Drawer>

    </>
  )
}

export default FlightResults