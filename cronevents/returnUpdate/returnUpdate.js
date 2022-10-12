const CronJob = require("node-cron");
const Returned = require("../../models/returned/returned");
const User = require("../../models/user/user");

const returnUpdate = async () => {
  //const scheduledJobFunction = CronJob.schedule("0 0 * * *", async () => {
  const scheduledJobFunction = CronJob.schedule("*/5 * * * *", async () => {
    try {
      //update return
      const result = await Returned.find();

      const update = await new Promise(async (resolve, reject) => {
        bulk = [];

        result.forEach(async (item, index) => {
          const today = new Date();
          const paymentDay = item.paymentIn;

          if (today.getTime() > paymentDay && item.completed == false)
            try {
              const user = await User.findById(item.user);
              const pending = item.amount + user.pendingPaid;

              await User.updateOne(
                {
                  _id: item.user,
                },
                { $set: { pendingPaid: pending } }
              );

              await Returned.updateOne(
                {
                  _id: item._id,
                },
                { $set: { completed: true } }
              );

              resolve(true);
            } catch (error) {
              reject(error);
            }
          else resolve(false);
        });
      });

      if (update) {
        console.log("Stake Cron completed");
      } else console.log("Stake Cron Error");
    } catch (error) {
      console.error(error);
    }
  });

  scheduledJobFunction.start();
};

module.exports = returnUpdate;
