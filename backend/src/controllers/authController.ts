import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        // get data
        const { email, password } = req.body;

        //check fields
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }

        //check email, password
        if (typeof email !== "string" || !email.includes("@")) {
            res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
            return;
        }

        if (typeof password !== "string" || password.length < 8) {
            res.status(400).json({
                success: false,
                message: "Password must be atleast 8 characters long"
            });
            return;
        }

        //check user
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists"
            });
            return;
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        // console.log(newUser);

        //generate token
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, { expiresIn: "24h" });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        // get data
        const { email, password } = req.body;

        // check fields
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return;
        }

        // get user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
            return;
        }

        // check pass
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({
                success: false,
                message: "Invalid password"
            });
            return;
        }

        // generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "24h" });

        res.status(200).json({
            success: true,
            message: "Login successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export { register, login }