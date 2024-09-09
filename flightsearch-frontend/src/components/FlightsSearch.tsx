import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification, Card, Form, Select, DatePicker, InputNumber, Checkbox, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';
import axios from 'axios';
import dayjs from 'dayjs';

type NotificationType = 'success' | 'info' | 'warning' | 'error';
const { Option } = Select;

interface AirportOption {
    code: string;
    name: string;
}

const FlightSearch: React.FC = () => {
    const [options1, setOptions1] = useState<AirportOption[]>([]);
    const [options2, setOptions2] = useState<AirportOption[]>([]);
    const [api, contextHolder] = notification.useNotification();
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (startDate === null) {
            form.setFieldsValue({ returnDate: null })
        }
        else if (returnDate !== null) {
            startDate > returnDate ? form.setFieldsValue({ returnDate: null }) : setReturnDate(returnDate);
        }
    }, [startDate, returnDate])

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
                openNotification('error');
                setOptions([]);
            }
        } else {
            setOptions([]);
        }
    }

    const openNotification = (type: NotificationType) => {
        api[type]({
            message: 'Fetching error',
            description:
                'Could not fetch the data from the server: Contact your administrator',
            showProgress: true,
            pauseOnHover: true,
        });
    };

    const disabledDate = (current: Dayjs | null): boolean => {
        if (!current) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return current.toDate() < today;
    }

    const disabledReturnDate = (current: Dayjs): boolean => {
        if (!startDate) {
            return false;
        }

        return current && current < startDate.endOf('day');
    }

    const onChangeDepartureDate = (date: Dayjs | null) => {
        setStartDate(date);
        date === null ? setIsDisabled(true) : setIsDisabled(false);
        if (!date || !returnDate) return false;

    }

    const onChangeReturnDate = (date: React.SetStateAction<Dayjs | null>) => {
        setReturnDate(date);
    }

    const onFinish = (values: any) => {
        values.departureDate = dayjs(values.departureDate).format('YYYY-MM-DD')
        values.returnDate ? values.returnDate = dayjs(values.returnDate).format('YYYY-MM-DD') : values.returnDate = null;
        navigate('/FlightResults', {
            state: values
        });
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            {contextHolder}
            <Card title="Flight Search" style={{ width: "100%", maxWidth: 600 }}>
                <Form
                    onFinish={onFinish}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    layout='horizontal'
                    form={form}>
                    <Form.Item name="departureCode" label="Departure Airport"
                        rules={[{ required: true, message: 'Please input your departure airport!' }]}
                    >
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
                    <Form.Item name="arrivalCode" label="Arrival Airport"
                        rules={[{ required: true, message: 'Please input your arrival airport!' }]}
                    >
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
                    <Form.Item name="departureDate" label="Departure Date" rules={[{ required: true, message: 'Please input your departure date!' }]}>
                        <DatePicker
                            value={startDate}
                            disabledDate={disabledDate}
                            onChange={(date) => onChangeDepartureDate(date)}
                        />
                    </Form.Item>
                    <Form.Item name="returnDate" label="Return Date">
                        <DatePicker
                            disabled={isDisabled}
                            disabledDate={disabledReturnDate}
                            onChange={(date) => onChangeReturnDate(date)}
                            value={returnDate}
                        />
                    </Form.Item>
                    <Form.Item name="numberOfAdults" label="Number of Adults" rules={[{ required: true, message: 'Please input the number of adults!' }]}>
                        <InputNumber min={1} max={9} />
                    </Form.Item>
                    <Form.Item name="currency" label="Currency" rules={[{ required: true, message: 'Please input the currency you want the results to be shown!' }]}>
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