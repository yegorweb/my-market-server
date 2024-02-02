import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken'
import { Model } from 'mongoose';
import { User } from 'src/user/interfaces/user.interface';
import { Token } from './interfaces/token.interface';
import { TokenClass } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel('Token') private TokenModel: Model<TokenClass>,
		private jwtService: JwtService
	) {}

  validateResetToken(token: string, secret: string): User {
		try {
			let payload: any = jwt.verify(token, secret)
			return payload
		} catch (error) {
			return null
		}
	}

	createResetToken(payload, secret: string): string {
		try {
			let result = jwt.sign(payload, secret, { expiresIn: '15m' })
			return result
		} catch (error) {
			return null
		}
	}

	generateToken(payload: Object): { accessToken: string, refreshToken: string } {
		try {
			const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '60m' })
			const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })

			return { accessToken, refreshToken }
		} catch (error) {
			console.log(error)
			return { accessToken: null, refreshToken: null }
		}
	}

	validateAccessToken(token: string): User {
		try {
			const userData: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
			return userData
		} catch (error) {
			return null
		}
	}

	validateRefreshToken(token: string): User {
		try {
			const userData: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
			return userData
		} catch (error) {
			return null
		}
	}

	async saveToken(refreshToken: string): Promise<Token> {
		return await this.TokenModel.create({ refreshToken })
	}

	async removeToken(refreshToken: string) {
		const tokenData = await this.TokenModel.deleteOne({ refreshToken })
		return tokenData
	}

	async findToken(refreshToken: string) {
		const tokenData = await this.TokenModel.findOne({ refreshToken })
		return tokenData
	}
}
