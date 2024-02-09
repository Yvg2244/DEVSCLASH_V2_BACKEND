import async_handler from "../utils/async_handler.js";
import { api_error } from "../utils/api_error.js";
import { user_model } from "../models/users/user_model.js";
import upload_file_on_cloudinary from "../utils/cloudinary.js";
import { api_response } from "../utils/api_response.js";
const generate_access_and_refresh_token = async (user_id) => {
  try {
    const user = await user_model.findById(user_id);
    const access_token = await user.generate_access_token();
    const refresh_token = await user.generate_refresh_token();
    user.refresh_token = refresh_token;
    await user.save({ validateBeforeSave: false });
    return { access_token, refresh_token };
  } catch (err) {
    throw new api_error(500, "Error while generating Tokens");
  }
};
const register_user = async_handler(async (req, res) => {
  // user_input
  // input_validation
  // existing_user
  // check_image ? upload to cloudinary : null
  // create_user
  // send_response, remove_password & refresh token
  // check_user_creation
  //return_response
  const { user_name, user_email, user_password } = req.body;
  if (
    [user_name, user_email, user_password].some((feild) => feild?.trim() == "")
  ) {
    throw new api_error(400, "All fields are required");
  }
  if (user_email?.includes("@") == false) {
    throw new api_error(400, "Invalid email");
  }
  if (user_password?.length < 6) {
    throw new api_error(400, "Password is too short");
  }

  const existing_user = await user_model.findOne({
    $or: [{ user_name }, { user_email }],
  });
  if (existing_user) {
    throw new api_error(409, "User with email or user name  exists");
  }

  const local_image_path = req.files?.user_image[0].path;
  console.log(local_image_path);
  if (!local_image_path) {
    throw new api_error(400, "User image is required");
  }

  const user_image = await upload_file_on_cloudinary(local_image_path);
  if (!user_image) {
    throw new api_error(400, "User image upload failed");
  }
  // console.log(user_name,user_email,user_password)
  const user = await user_model.create({
    user_name: user_name.toLowerCase(),
    user_email,
    user_password,
    user_image: user_image.url,
  });
  const created_user = await user_model
    .findById(user._id)
    .select("-user_password -refresh_token");
  if (!created_user) {
    throw new api_error(500, "User creation failed");
  }

  return res
    .status(201)
    .json(new api_response(201, created_user, "User created successfully"));
});
const login_user = async_handler(async (req, res) => {
  //req data
  //check if it exists
  //check password
  //aceess and refresh token generate
  //send cookie and response
  const { user_name, user_email, user_password } = req.body;
  console.log(typeof(req.body));
  if (!(user_name || user_email)) {
    throw new api_error(400, "Username or Email feild is required");
  }
  const user = await user_model.findOne({
    $or: [{ user_name }, { user_email }],
  });
  if (!user) {
    throw new api_error(404, "User not found");
  }
  //your defined methods at avaliable at user instance and not at user_model
  const is_password_valid = await user.is_password_correct(user_password);
  if (!is_password_valid) {
    throw new api_error(401, "Incorrect Password");
  }
  const { access_token, refresh_token } =
    await generate_access_and_refresh_token(user._id);
  const logged_in_user = await user_model
    .findById(user._id)
    .select("-user_password -refresh_token");

  const options = {
    httpOnly: true,
    secure: false,
  };
  return res
    .status(200)
    .cookie("access_token", access_token, options)
    .cookie("refresh_token", refresh_token, options)
    .json(
      new api_response(
        200,
        { user: logged_in_user, access_token, refresh_token },
        "User logged in successfully"
      )
    );
});
const logout_user=async_handler(async(req,res)=>{ 
  console.log(req.user)
  await user_model.findByIdAndUpdate(req.user._id,{
    $set:{refresh_token:undefined}
  },{
    new:true
  })

  const options = {
    httpOnly: true,
    secure: false,
  };
  return res
    .status(200)
    .cookie("access_token", options)
    .cookie("refresh_token", options)
    .json(
      new api_response(
        200,
        {},
        "User logged out successfully"
      )
    );
})
const view_user=async_handler(async(req,res)=>{ 
  const user_data=await user_model.findById(req.user._id).select("-user_password -refresh_token -_id")
  return res.status(200).json(new api_response(200,user_data,"User data fetched successfully"))
})
export { login_user, register_user,logout_user,view_user}
