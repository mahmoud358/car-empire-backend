const APIERROR = require("./apiError");
const getAllCommentByRequestID = (requestID,limite,skip) => {

    try{

    }catch(error){
        throw new APIERROR(500, error.message)
    }

}