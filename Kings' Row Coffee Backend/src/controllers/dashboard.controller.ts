import express from "express";
import CoffeeModel from "../models/coffee.model";
import DessertModel from "../models/dessert.model";
import OrderModel from "../models/order.model";
import EmployeeModel from "../models/employee.model";
import CustomResponse from "../dtos/custom.response";

export let getToday = async (req: express.Request, res: any) => {

    try {

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        let sales = 0;
        let revenue = 0;

        const result = await OrderModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: startOfToday,
                        $lt: endOfToday,
                    }
                }
            },
            {
                $addFields: {
                    totalSum: {
                        $sum: "$orderDetails.total"
                    }
                }
            }
        ]).exec();

        if (result.length > 0){
            sales = result.length;
            result.map(value => revenue += value.totalSum);
        }

        res.status(200).send(
            new CustomResponse(200, "Access", [sales, revenue])
        );
    } catch (error) {
        res.status(500).send("Error");
    }
}


export const getRevenueChart = async (req: express.Request, res: any) => {

    try {

        const dateArray: String[] = [];
        const valueArray: number[] = [];
        const currentDate = new Date();
        const pastDate = new Date(currentDate);
        pastDate.setDate(currentDate.getDate() - 12);

        const result = await OrderModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: pastDate,
                        $lt: currentDate,
                    }
                }
            },
            {
                $unwind: "$orderDetails"
            },
            {
                $group: {
                    _id: {
                        date: {$dateToString: {format: "%m/%d", date: "$date"}},
                    },
                    totalAmount: {$sum: "$orderDetails.total"}
                }
            },
            {
                $group: {
                    _id: "$_id.date", // Group by date
                    orders: {
                        $push: {
                            totalAmount: "$totalAmount"
                        }
                    },
                    totalSum: {$sum: "$totalAmount"}
                }
            },
            {
                $sort: {"_id": 1}
            }
        ]).exec();

        /*const result = await OrderModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: pastDate,
                        $lt: currentDate,
                    }
                }
            },
            {
                $addFields: {
                    totalSum: {
                        $sum: "$orderDetails.total"
                    }
                }
            }
        ]).exec();*/

        result.map(value => {
            dateArray.push(value._id);
            valueArray.push(value.totalSum);
        });
        res.status(200).send(
            new CustomResponse(200, "Access", {
                date: dateArray,
                value: valueArray
            })
        );
    } catch (error) {
        res.status(500).send("Error");
    }
}


export const getMonthlyRevenue = async (req: express.Request, res: any) => {

    try {

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        let monthlyRevenue: number = 0;

        const result = await OrderModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: startOfMonth,
                        $lt: endOfMonth,
                    }
                }
            },
            {
                $addFields: {
                    totalSum: {
                        $sum: "$orderDetails.total"
                    }
                }
            }
        ]).exec();

        result.map(value => monthlyRevenue += value.totalSum);

        res.status(200).send(
            new CustomResponse(200, "Access", monthlyRevenue)
        );

    } catch (error) {
        res.status(500).send("Error");
    }
}


export const getStatic = async (req: express.Request, res: any) => {

    try {

        let totRevenue: number = 0;
        let orderCount: number = 0;
        let dessertCount: number = 0;
        let coffeeCount: number = 0;
        let employeeCount: number = 0;

        await OrderModel.countDocuments()
            .then(res => {
                orderCount = res;
            })
            .catch(reason => {
                console.log(reason)
            });
        await DessertModel.countDocuments()
            .then(res => {
                dessertCount = res;
            })
            .catch(reason => {
                console.log(reason)
            });
        await CoffeeModel.countDocuments()
            .then(res => {
                coffeeCount = res;
            })
            .catch(reason => {
                console.log(reason)
            });
        await EmployeeModel.countDocuments()
            .then(res => {
                employeeCount = res;
            })
            .catch(reason => {
                console.log(reason)
            });

        const result = await OrderModel.aggregate([
            {
                $addFields: {
                    totalSum: {
                        $sum: "$orderDetails.total"
                    }
                }
            }
        ]).exec();

        result.map(value => totRevenue += value.totalSum);

        res.status(200).send(
            new CustomResponse(200, "Access", [orderCount, employeeCount, dessertCount + coffeeCount, totRevenue])
        );

    } catch (error) {
        res.status(500).send("Error");
    }
};
