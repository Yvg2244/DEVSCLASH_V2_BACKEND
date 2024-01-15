const async_handler=(func)=>{
     return async(req,res,next)=>{
        try {
            await func(req,res,next)
        } catch (error) {
            res.status(541).json({success:false,message:`From Async handler Function: ${error.message}`})
        }
    }
}
   
export default async_handler
