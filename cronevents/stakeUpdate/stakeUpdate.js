const CronJob = require("node-cron");
const Stake = require("../../models/stake/stake");
const User = require("../../models/user/user");

const rankSorting = async () => {
  //const scheduledJobFunction = CronJob.schedule("0 0 * * *", async () => {
  const scheduledJobFunction = CronJob.schedule("*/5 * * * *", async () => {
    try {
      //delete completed stakes
      await Stake.deleteMany({ live: false });

      //update stakes
      const result = await Stake.find();

      const update = await new Promise(async (resolve, reject) => {
        bulk = [];

        result.forEach(async (item, index) => {
          const today = new Date();
          const lastPayment = new Date(item.lastPayment);
          // const nextPayment = new Date(
          //   lastPayment.getFullYear(),
          //   lastPayment.getMonth() + 2,
          //   0
          // );
          const nextPayment = new Date(
            lastPayment.getFullYear(),
            lastPayment.getMonth(),
            lastPayment.getDate(),
            lastPayment.getHours() + 1
          );
          if (today.getTime() > nextPayment.getTime())
            try {
              const user = await User.findById(item.user);
              const pending =
                item.cost * (item.stakeROI / 100) + user.pendingPaid;

              await User.updateOne(
                {
                  _id: item.user,
                },
                { $set: { pendingPaid: pending } }
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

module.exports = rankSorting;
