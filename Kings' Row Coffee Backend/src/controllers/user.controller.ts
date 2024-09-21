import express from "express";
import UserModel from "../models/user.model";
import CustomResponse from "../dtos/custom.response";
import * as SchemaTypes from "../types/schema.types";
import jwt, {Secret} from "jsonwebtoken";
import process from "process";
import bcrypt from "bcryptjs"
import EmployeeModel from "../models/employee.model";

export const createNewUser = async (req: express.Request, res: express.Response) => {
    try {

        const req_body: any = req.body;

        let existUser = await UserModel.findOne({email: req_body.email})
            .catch(reason => {
                console.log(reason)
            });

        if (existUser) {
            res.status(401).send(
                new CustomResponse(401, "Email already exists !")
            );
            return;
        }

        // encode password
        await bcrypt.hash(req_body.password, 8, async function (err, hash){
            if (err){
                res.status(500).send(
                    new CustomResponse(
                        500,
                        "Something went wrong"
                    )
                );
            }
            const userModel = new UserModel({
                fname: req_body.fname,
                lname: req_body.lname,
                email: req_body.email,
                password: hash
            });

            let user: SchemaTypes.IUser | null = await userModel.save();
            if (user) {

                user.password = "";
                const expiresIn = "1w"

                // token generate
                jwt.sign({user}, process.env.SECRET as Secret, {expiresIn}, (err: any, token: any) => {

                    if (err) {
                        res.status(500).send(
                            new CustomResponse(500, "Something went wrong")
                        );
                    } else {

                        let res_body = {
                            user: user,
                            accessToken: token
                        }
                        res.status(200).send(
                            new CustomResponse(200, "User created successfully", res_body)
                        );
                    }
                });

                /*res.status(200).send(
                    new CustomResponse(
                        200,
                        "User created successfully",
                        user
                    )
                );*/
            } else {
                res.status(100).send(
                    new CustomResponse(
                        100,
                        "Something went wrong !",
                        user
                    )
                );
            }
        });
    } catch (error) {
        res.status(100).send("Error")
    }

}

export const authUser = async (req: express.Request, res: express.Response) => {
    try {

        let request_body = req.body

        let user: SchemaTypes.IUser | null = await UserModel.findOne({email: request_body.email});

        if (user) {

            // check is match bcrypt pass and request pass

            let isMatch = await bcrypt.compare(request_body.password, user.password);

            if (isMatch) {

                user.password = "";
                const expiresIn = "1w"

                // token generate
                jwt.sign({user}, process.env.SECRET as Secret, {expiresIn}, (err: any, token: any) => {

                    if (err) {
                        res.status(500).send(
                            new CustomResponse(500, "Something went wrong")
                        );
                    } else {

                        let res_body = {
                            user: user,
                            accessToken: token
                        }
                        res.status(200).send(
                            new CustomResponse(200, "Access", res_body)
                        );
                    }
                });
            } else {
                res.status(401).send(
                    new CustomResponse(401, "Invalid credentials")
                );
            }
        } else {
            res.status(404).send(
                new CustomResponse(404, "User not found")
            );
        }

    } catch (error) {
        res.status(500).send("Error");
    }
}

