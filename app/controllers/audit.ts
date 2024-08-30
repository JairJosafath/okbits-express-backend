import { sequelize } from "../config/db";
import AuditModel from "../models/audit";
import { AuditI } from "../utils/types";

export async function addAudit(data: AuditI) {
  try {
    const Audit = await AuditModel.create(data);
    console.log(Audit.toJSON(), "add");
    return Audit.get("id");
  } catch (e) {
    console.log("couldnt add audit", e);
  }
  return null;
}
export async function getAuditByID(id: number) {
  try {
    const Audit = await AuditModel.findByPk(id);
    if (!Audit) {
      console.log("record not found with id " + id);
    }
    console.log(Audit?.toJSON(), "update");
    return Audit;
  } catch (e) {
    console.log("could not retrieve record", e);
  }
  return null;
}
export async function getAuditsByUser(userid: number) {
  try {
    const Audits = await AuditModel.findAll({ where: { user_id: userid } });
    if (Audits.length < 1) {
      console.log("record not found with id " + userid);
    }
    console.log(Audits, "audits by user");
    return Audits;
  } catch (e) {
    console.log("could not retrieve record", e);
  }
  return null;
}

export async function deleteAuditByID(id: number) {
  try {
    const Audit = await getAuditByID(id);
    await Audit?.destroy();
    console.log("deleted");
    return true;
  } catch (e) {
    console.log("could not delete record", e);
    return false;
  }
}
export async function updateAuditByID(id: number, data: AuditI) {
  try {
    const Audit = await getAuditByID(id);
    Audit?.set({ Audit, ...data });
    const res = await Audit?.save();
    console.log("update res", res);
    return true;
  } catch (e) {
    console.log("could not update record", e);
    return false;
  }
}
