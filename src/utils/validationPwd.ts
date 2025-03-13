import PasswordValidator from "password-validator";

const validator = new PasswordValidator();
validator
  .is()
  .min(6)
  .is()
  .max(20)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols()
  .has()
  .not()
  .spaces();
export default validator;
