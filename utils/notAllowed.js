
export const notAllowed = (req, res, next) => {
    res.status(405).json({
        status: 'error',
        message: 'Method not allowed' 
    });
}



// midlleware work in project
//incomming data filter and  validation, checkUp garna lai