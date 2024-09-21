import express from "express";
import * as Middleware from "../middlewares";
import * as DashboardController from "../controllers/dashboard.controller";


const router = express.Router();

router.get('/getStatic', DashboardController.getStatic);

router.get('/get-today/Static', DashboardController.getToday);

router.get('/get-monthly/revenue', DashboardController.getMonthlyRevenue);

router.get('/get-monthly/revenue-chart', DashboardController.getRevenueChart);

export default router;
