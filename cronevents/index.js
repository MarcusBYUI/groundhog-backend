const stakeUpdate = require("./stakeUpdate/stakeUpdate");
const returnUpdate = require("./returnUpdate/returnUpdate");

const initCronJobs = () => {
  //checks to assign stake rewards
  stakeUpdate();
  returnUpdate();
};

module.exports = initCronJobs;
