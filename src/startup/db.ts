import { V0MODELS } from "../../src/controllers/vo/model.index";
import { sequelize } from "../sequelize";

module.exports = async () => {
  sequelize.addModels(V0MODELS);
  await sequelize.sync();
};
