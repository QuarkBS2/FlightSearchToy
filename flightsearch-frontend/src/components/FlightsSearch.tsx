import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Select, DatePicker, InputNumber, Checkbox, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

interface AirportOption {
    code: string;
    name: string;
}

const FlightSearch: React.FC = () => {
    const [options1, setOptions1] = useState<AirportOption[]>([]);
    const [options2, setOptions2] = useState<AirportOption[]>([]);

    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [arrivalDate, setArrivalDate] = useState<Dayjs | null>(null);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const fetchAirports = async (keyword: string, setOptions: React.Dispatch<React.SetStateAction<AirportOption[]>>) => {
        if (keyword.length > 2) {
            try {
                const response = await axios.get('http://localhost:8080/api/amadeus/airports?subType=AIRPORT', {
                    params: { keyword }
                });

                const airports = response.data.data.map((item: any) => ({
                    code: item.iataCode,
                    name: item.name,
                }))

                setOptions(airports);
            } catch (error) {
                console.error("Error fetching airport data", error);
                setOptions([]);
            }
        } else {
            setOptions([]);
        }
    }

    const disabledDate = (current: Dayjs | null): boolean => {
        if (!current) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return current.toDate() < today;
    }

    const onChangeDepartureDate = (date: React.SetStateAction<Dayjs | null>) => {
        setStartDate(date)
        if (!date || !arrivalDate) return false;

        if (date > arrivalDate) {
            setArrivalDate(null);
            disabledArrivalDate(null);
        }


    }

    const disabledArrivalDate = (current: Dayjs | null): boolean => {
        if (!current || !startDate) return false;

        return current.toDate() < startDate.add(1, 'day').toDate();
    }

    const onFinish = (values: any) => {
        values.departureDate = dayjs(values.departureDate).format('YYYY-MM-DD')
        values.returnDate = dayjs(values.returnDate).format('YYYY-MM-DD')
        navigate('/FlightResults', {
            state: values
        });
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Card title="Flight Search" style={{ width: "100%", maxWidth: 600 }}>
                <Form
                    onFinish={onFinish}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    layout='horizontal'>
                    <Form.Item name="departureCode" label="Departure Airport">
                        <Select
                            showSearch
                            onSearch={(keyword) => fetchAirports(keyword, setOptions1)}
                            filterOption={false}
                        >
                            {options1.map((airport) => (
                                <Option key={airport.code} value={airport.code}>{airport.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="arrivalCode" label="Arrival Airport">
                        <Select
                            showSearch
                            onSearch={(keyword) => fetchAirports(keyword, setOptions2)}
                            filterOption={false}
                        >
                            {options2.map((airport) => (
                                <Option key={airport.code} value={airport.code}>{airport.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="departureDate" label="Departure Date">
                        <DatePicker
                            disabledDate={disabledDate}
                            onChange={(date) => onChangeDepartureDate(date)}
                        />
                    </Form.Item>
                    <Form.Item name="returnDate" label="Return Date">
                        <DatePicker
                            disabledDate={disabledArrivalDate}
                            onChange={(date) => setArrivalDate(date)}
                            value={arrivalDate}
                        />
                    </Form.Item>
                    <Form.Item name="numberOfAdults" label="Number of Adults">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name="currency" label="Currency">
                        <Select>
                            <Select.Option value="USD">USD</Select.Option>
                            <Select.Option value="MXN">MXN</Select.Option>
                            <Select.Option value="EUR">EUR</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="nonStop" valuePropName="checked">
                        <Checkbox defaultChecked={false} >Non-stop</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Search</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default FlightSearch;