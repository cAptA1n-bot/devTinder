const cron = require('node-cron');
const ConnectionRequestModel = require('../models/ConnectionRequest');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const sendEmail = require('./sendEmail.js')

cron.schedule("0 8 * * *", async () => {
    try{
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        const pendingRequest = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId")

        const listOfEmails = [...new Set((pendingRequest.map(req => req.toUserId.email)))]
        console.log(listOfEmails);

        for(const email of listOfEmails){
            try{
                const res = await sendEmail.run("New connection requests pending! "+email, "You have new connection requests. People want to connect with you and collaborate.");
            }
            catch(err){
                console.log(err);
            }
        }
    }
    catch(err){
        console.log(err);
    }
})