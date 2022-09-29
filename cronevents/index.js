const stakeUpdate = require("./stakeUpdate/stakeUpdate");

const initCronJobs = () => {
  //checks to assign stake rewards
  stakeUpdate();
};

module.exports = initCronJobs;
