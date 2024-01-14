const async_handler=(func)=>{
     async(req,res,next)=>{
        try {
            await func(req,res,next)
        } catch (error) {
            res.status(error.code||500).json({success:false,message:error.message})
        }
    }
}
export {async_handler}
// const async_handler=(req_handler)=>{
//     (req,res,next)=>{
//         Promise.resolve(req_handler(req,res,next)).catch(next(err))
//     }
// }