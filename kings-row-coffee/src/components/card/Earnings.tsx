// ** Third Party Components
import Chart from 'react-apexcharts'
import axios from "axios";
import {useEffect, useRef, useState} from "react";
import {Card, CardTitle, CardText, CardBody, Row, Col} from 'reactstrap'

// @ts-ignore
const Earnings = ({success}) => {

    const [total, setTotal] = useState(0)
    const hasFetchedData = useRef(false);

    const fetchData = () => {
        if (hasFetchedData.current) return;
        hasFetchedData.current = true;
        axios.get('http://localhost:8080/dashboard/get-monthly/revenue')
            .then(response => {
                setTotal(response.data.data);

            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const options = {
        chart: {
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {show: false},
        comparedResult: [2, -3, 8],
        labels: ['App', 'Service', 'Product'],
        stroke: {width: 0},
        colors: ['#28c76f66', '#28c76f33', success],
        grid: {
            padding: {
                right: -20,
                bottom: -8,
                left: -20
            }
        },
        plotOptions: {
            pie: {
                startAngle: -10,
                donut: {
                    labels: {
                        show: true,
                        name: {
                            offsetY: 15
                        },
                        value: {
                            offsetY: -15,
                            formatter(val: string) {
                                return `${parseInt(val)} %`
                            }
                        },
                        total: {
                            show: true,
                            offsetY: 15,
                            label: 'App',
                            formatter() {
                                return '53%'
                            }
                        }
                    }
                }
            }
        },
        responsive: [
            {
                breakpoint: 1325,
                options: {
                    chart: {
                        height: 100
                    }
                }
            },
            {
                breakpoint: 1200,
                options: {
                    chart: {
                        height: 120
                    }
                }
            },
            {
                breakpoint: 1065,
                options: {
                    chart: {
                        height: 100
                    }
                }
            },
            {
                breakpoint: 992,
                options: {
                    chart: {
                        height: 120
                    }
                }
            }
        ]
    }

    return (
        <Card className='earnings-card min-h-48 px-3 bg-white border-0 rounded-xl shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]'>
            <CardBody>
                <Row>
                    <Col xs='6'>
                        <CardTitle className='mb-1 text-xl  tracking-wide font-cde'>Earnings</CardTitle>
                        <div className='font-small-2 text-[11px] font-cde pt-2 text-gray-400'>This Month</div>
                        <h5 className='mb-1 font-cde text-xl text-gray-600'>$ {total}</h5>
                        <CardText className='font-small-2 text-gray-400 pt-3 font-cde text-[12px]'>
                            <span className='fw-bolder'>68.2%</span>
                            <span> more earnings than last month.</span>
                        </CardText>
                    </Col>
                    <Col xs='6'>
                        <Chart options={options} series={[80, 16, 31]} type='donut' height={150}/>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default Earnings
