import db from '../../server/database/config/knex';

class DbService {
  static async verifyAuxiliaryNurse(auxNurseId) {
    const verifiedAuxNurse = await db('auxillarynurses')
      .update('isverified', true)
      .where('auxillary_nurses_id', auxNurseId);

    return verifiedAuxNurse;
  }

  static async approveAuxiliaryNurse(auxNurseId) {
    const verifiedAuxNurse = await db('auxillarynurses')
      .update('approval_status', 'approved')
      .where('auxillary_nurses_id', auxNurseId);

    return verifiedAuxNurse;
  }

  static async changeAuxiliaryNurseActiveStatus(auxNurseId, activate) {
    const verifiedAuxNurse = await db('auxillarynurses')
      .update('isactive', activate)
      .where('auxillary_nurses_id', auxNurseId);

    return verifiedAuxNurse;
  }
}

export default DbService;
