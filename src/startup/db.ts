import { V0MODELS } from "../controllers/v0/model.index";
import { sequelize } from "../sequelize";

module.exports = async () => {
  sequelize.addModels(V0MODELS);
  await sequelize.sync();
};
