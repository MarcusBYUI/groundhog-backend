const CronJob = require("node-cron");
const Stake = require("../../models/stake/stake");
const User = require("../../models/user/user");

const stakeUpdate = async () => {
  const scheduledJobFunction = CronJob.schedule("0 0 * * *", async () => {
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
          const nextPayment = new Date(
            lastPayment.getFullYear(),
            lastPayment.getMonth() + 2,
            0
          );
          if (
            today.getTime() > nextPayment.getTime() &&
            item.completed == false
          )
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

              await Stake.updateOne(
                {
                  _id: item._id,
                },
                { $set: { lastPayment: Date.now() } }
              );

              if (new Date().getTime() > item.stakeEnd) {
                await Stake.updateOne(
                  {
                    _id: item._id,
                  },
                  { $set: { completed: true } }
                );
              }

              resolve(true);
            } catch (error) {
              reject(error);
            }
          else resolve(false);
        });
      });

      if (update) {
        console.log("Stake Cron completed");
      } else console.log("Stake Cron has no result");
    } catch (error) {
      console.error(error);
    }
  });

  scheduledJobFunction.start();
};

module.exports = stakeUpdate;
