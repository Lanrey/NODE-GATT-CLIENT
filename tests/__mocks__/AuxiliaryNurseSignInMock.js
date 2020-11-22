import faker from 'faker';

class AuxiliaryNurseSignInMock {
  static get_empty_json_object() {
    return {};
  }

  static get_signin_info_with_all_fields_invalid() {
    return {
      email: faker.finance.amount(),
      phoneNumber: faker.finance.amount(),
      password: faker.finance.amount(),
      deviceImei: faker.finance.amount()
    };
  }

  static get_valid_signin_info_with_unwanted_fields(valid_created_user) {
    return {
      ...this.get_valid_signin_info_with_both_email_and_phone_for_same_user(valid_created_user),
      unwanted_field_12345: '',
      isactive: false
    };
  }

  static get_valid_signin_info_with_both_email_and_phone_for_same_user(valid_created_user) {
    return {
      email: valid_created_user.email_address,
      phoneNumber: valid_created_user.phone_number,
      password: valid_created_user.password,
      deviceImei: this.get_valid_phone_imei()
    };
  }

  static get_invalid_signin_info_with_email_and_phone_for_different_existing_users(
    valid_created_user1,
    valid_created_user2
  ) {
    return {
      email: valid_created_user1.email_address,
      phoneNumber: valid_created_user2.phone_number,
      password: valid_created_user1.password,
      deviceImei: this.get_valid_phone_imei()
    };
  }

  static get_signin_info_with_both_email_and_phone_for_same_user_and_wrong_password(valid_created_user) {
    return {
      ...this.get_valid_signin_info_with_both_email_and_phone_for_same_user(valid_created_user),
      password: 'wrong_pw#wellness@12'
    };
  }

  static get_signin_info_with_both_email_and_phone_for_same_user_and_wrong_phoneimei(
    valid_created_user,
    correct_device_imei
  ) {
    return {
      ...this.get_valid_signin_info_with_both_email_and_phone_for_same_user(valid_created_user),
      deviceImei: this.get_different_valid_phone_imei(correct_device_imei)
    };
  }

  static get_valid_email_signin_info_with_missing_phone_field(valid_created_user) {
    return {
      email: valid_created_user.email_address,
      password: valid_created_user.password,
      deviceImei: this.get_valid_phone_imei()
    };
  }

  static get_valid_phone_signin_info_with_missing_email_field(valid_created_user) {
    return {
      phoneNumber: valid_created_user.phone_number,
      password: valid_created_user.password,
      deviceImei: this.get_valid_phone_imei()
    };
  }

  static get_valid_email_signin_info_with_phone_field_having_null(valid_created_user) {
    return {
      email: valid_created_user.email_address,
      phoneNumber: null,
      password: valid_created_user.password,
      deviceImei: this.get_valid_phone_imei()
    };
  }

  static get_valid_phone_signin_info_with_email_field_having_null(valid_created_user) {
    return {
      email: null,
      phoneNumber: valid_created_user.phone_number,
      password: valid_created_user.password,
      deviceImei: this.get_valid_phone_imei()
    };
  }

  static get_invalid_signin_info_with_both_email_and_phone_field_having_null() {
    return {
      email: null,
      phoneNumber: null,
      password: 'any_password',
      deviceImei: this.get_valid_phone_imei()
    };
  }

  static get_signin_info_with_valid_fields_except_email_invalid() {
    return {
      ...this.get_base_signin_info_with_all_fields_valid(),
      email: faker.random.alphaNumeric(20)
    };
  }

  static get_signin_info_with_valid_fields_except_phone_invalid() {
    return {
      ...this.get_base_signin_info_with_all_fields_valid(),
      phoneNumber: faker.random.alphaNumeric(20)
    };
  }

  static get_signin_info_with_valid_fields_except_password_invalid() {
    return {
      ...this.get_base_signin_info_with_all_fields_valid(),
      password: faker.random.alphaNumeric(3)
    };
  }

  static get_signin_info_with_valid_fields_except_imei_invalid() {
    return {
      ...this.get_base_signin_info_with_all_fields_valid(),
      deviceImei: faker.random.alphaNumeric(15)
    };
  }

  static get_signin_info_with_valid_fields_but_user_does_not_exist() {
    return {
      ...this.get_base_signin_info_with_all_fields_valid(),
      email: 'email.doesnotexist@wellness-micro.com',
      phoneNumber: '08088889999'
    };
  }

  static get_base_signin_info_with_all_fields_valid() {
    return {
      email: faker.internet.email(),
      phoneNumber: faker.random.number({ min: 1000000000, max: 99999999999 }).toString(),
      password: faker.internet.password(6),
      deviceImei: this.get_valid_phone_imei()
    };
  }

  static get_valid_phone_imei() {
    return faker.random.number({ min: 100000000000000, max: 999999999999999 }).toString();
  }

  static get_invalid_phone_imei() {
    return faker.random.number({ min: -1000000000, max: 99999999999999 }).toString();
  }

  static get_different_valid_phone_imei(current_imei) {
    const newFirstDigit = ((parseInt(current_imei[0]) + 1) % 9) + 1;

    const newImie = newFirstDigit.toString() + current_imei.substring(1);

    return newImie;
  }
}

export default AuxiliaryNurseSignInMock;
