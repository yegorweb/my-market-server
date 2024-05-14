import mongoose from "mongoose"
import { User } from "src/user/interfaces/user.interface"

export default interface Entry {
  _id: mongoose.Types.ObjectId
  title: string
  description: string
  author: User
  responses: mongoose.Types.ObjectId[]
  address: string
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
  images: string[]
}