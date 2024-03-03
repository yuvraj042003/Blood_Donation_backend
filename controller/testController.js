const testController = (req,res) => {
    res.status(200).send({
        message: "This is test controller",
        success:true,
    })
} 

module.exports = {testController}