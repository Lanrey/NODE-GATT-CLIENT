import faker from 'faker';

class AuxiliaryNurseMock {
  static get_create_with_empty_fields() {
    return {};
  }

  static get_create_with_valid_compulsory_fields_only() {
    return {
      email_address: faker.internet.email(),
      password: faker.internet.password(6),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      phone_number: faker.random.number({ min: 1000000000, max: 99999999999 }).toString()
    };
  }

  static get_create_with_invalid_compulsory_fields_only() {
    return {
      email_address: faker.finance.amount(),
      password: faker.finance.amount(),
      first_name: faker.finance.amount(),
      last_name: faker.finance.amount(),
      phone_number: faker.finance.amount()
    };
  }

  static get_create_with_valid_compulsory_fields_and_unwanted_fields() {
    return {
      ...this.get_create_with_valid_compulsory_fields_only(),
      auxillary_nurses_id: faker.random.uuid,
      isverified: true,
      isactive: false,
      approval_status: 'wrong_approval_status',
      created_at: 'wrong_created_at',
      updated_at: 'wrong_updated_at',
      agent_profile_image: 'wrong_mobile_profile_image',
      mobile_profile_image: 'wrong_mobile_profile_image'
    };
  }

  static get_create_with_valid_compulsory_fields_and_unknown_field() {
    return {
      ...this.get_create_with_valid_compulsory_fields_only(),
      unknown_field_12345: ''
    };
  }

  static get_create_with_valid_compulsory_fields_except_password_with_length_less_than_minimum() {
    return {
      ...this.get_create_with_valid_compulsory_fields_only(),
      password: faker.internet.password(4)
    };
  }

  static get_create_with_valid_compulsory_fields_except_password_with_length_greater_than_maximum() {
    return {
      ...this.get_create_with_valid_compulsory_fields_only(),
      password: faker.internet.password(30)
    };
  }

  static get_create_with_valid_compulsory_fields_except_password_with_space_as_prefix_and_suffix() {
    return {
      ...this.get_create_with_valid_compulsory_fields_only(),
      password: `  ${faker.internet.password(10)}   `
    };
  }

  static get_create_with_valid_compulsory_fields_except_email_with_no_at_symbol() {
    return {
      ...this.get_create_with_valid_compulsory_fields_only(),
      email_address: faker.name.firstName()
    };
  }

  static get_create_with_valid_compulsory_fields_except_email_with_space_in_between() {
    return {
      ...this.get_create_with_valid_compulsory_fields_only(),
      email_address: faker.name.findName()
    };
  }

  static get_create_with_valid_compulsory_fields_including_email_with_space_as_prefix_and_suffix() {
    return {
      ...this.get_create_with_valid_compulsory_fields_only(),
      email_address: `  ${faker.internet.email()}   `
    };
  }

  static get_create_with_valid_compulsory_fields_except_phone_as_alphabets() {
    return {
      ...this.get_create_with_valid_compulsory_fields_only(),
      phone_number: 'abcdefghijk'
    };
  }

  static get_create_with_valid_compulsory_fields_except_phone_as_alphanumeric() {
    return {
      ...this.get_create_with_valid_compulsory_fields_only(),
      phone_number: faker.random.alphaNumeric(11)
    };
  }

  static get_create_with_valid_compulsory_fields_including_phone_with_space_as_prefix_and_suffix() {
    return {
      ...this.get_create_with_valid_compulsory_fields_only(),
      phone_number: `  ${faker.random.number({ min: 1000000000, max: 99999999999 }).toString()}   `
    };
  }
}

export default AuxiliaryNurseMock;
