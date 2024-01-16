import { new_room_model } from "../models/rooms/new_room_model.js"
import { user_model } from "../models/users/user_model.js"
import { api_error } from "../utils/api_error.js"
import { api_response } from "../utils/api_response.js"
import async_handler from "../utils/async_handler.js"
const create_room = async_handler(async (req, res) => {
    //check valid user :- i think its done in verify_jwt
    const user=await user_model.findById(req.user._id)
    //req room data
    const  {topic,duration,no_of_question,start_time,difficulty,room_type}=req.body
    //validate room data
    console.log(topic,duration,no_of_question,start_time,difficulty,room_type)
    if([topic,duration,no_of_question,start_time,difficulty,room_type].some(feild=>feild?.trim()==="")){
        throw new api_error(400,"All fields are required")
    }
    //create room
    const create_room=await new_room_model.create({
        topic,
        duration,
        no_of_question,
        start_time,
        difficulty,
        room_type
    })
    console.log(create_room)
    const created_room=await new_room_model.findById(create_room._id)
    if(!created_room){
        throw new api_error(500,"Room creation failed")
    }
    //update created rooms in user model
    user.upcoming_contests.push(created_room._id)
    await user.save()
    //return response
    return res.status(201).json(new api_response(201,created_room,"Room created successfully"))
})
export {create_room}