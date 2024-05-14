import { User } from "src/user/interfaces/user.interface"

export default interface EntryFromClient {
  _id: string
  title: string
  description: string
  author: User
  responses: string[]
  address: string
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
  images: string[]
}