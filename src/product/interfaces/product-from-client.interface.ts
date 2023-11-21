import { User } from "src/user/interfaces/user.interface"

export default interface EntryFromClient {
  _id: string
  title: string
  description: string
  author: User
  responses: string[]
  date: number
  on_moderation: boolean
  moderation_result?: boolean
}