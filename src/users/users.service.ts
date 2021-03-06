import { Injectable } from '@nestjs/common';
import { prisma } from '../../prisma';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    async findOne(email: string) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            return user;
        } catch (err) {
            throw new HttpException("Can't find user", 400);
        }
    }

    async createOne(username: string, email: string, password: string) {
        try {
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(password, salt);

            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hash,
                },
            });

            return user;
        } catch (err) {
            throw new HttpException("Can't create user", 400);
        }
    }

    async addToCart(email: string, ProductId: string) {
        try {
            const product = await prisma.product.findUnique({
                where: {
                    id: ProductId,
                },
            });

            const user = await prisma.user.update({
                where: {
                    email,
                },
                data: {
                    products: {
                        set: {
                            title: product.title,
                        },
                    },
                },
            });

            return product;
        } catch (err) {
            throw new HttpException(err, 400);
        }
    }
}
