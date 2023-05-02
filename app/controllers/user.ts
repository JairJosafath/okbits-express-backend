import UserModel from "../models/user";
import { UserI } from "../utils/types";

export async function addUser(data: UserI) {
  try {
    const User = await UserModel.create(data);
    console.log(User.toJSON(), "add");
    return User.toJSON();
  } catch (e) {
    console.log("couldnt add user", e);
    return null;
  }
}
export async function getUserByID(id: number) {
  try {
    const User = await UserModel.findByPk(id);
    if (!User) {
      console.log("record not found with id " + id);
    }
    console.log(User?.toJSON(), "update");
    return User;
  } catch (e) {
    console.log("could not retrieve record", e);
    return null;
  }
}

export async function deleteUserByID(id: number) {
  try {
    const User = await getUserByID(id);
    await User?.destroy();
    console.log("deleted");
    return true;
  } catch (e) {
    console.log("could not delete record", e);
    return false;
  }
}
export async function updateUserByID(id: number, data: UserI) {
  try {
    const User = await getUserByID(id);
    User?.set({ ...data });
    await User?.save();
    console.log("updated");
    return true;
  } catch (e) {
    console.log("could not update record", e);
    return false;
  }
}

export async function findUserByUsername(
  username: string
): Promise<UserI | null> {
  try {
    const user = await UserModel.findOne({ where: { username } });
    if (user === null) {
      console.log("User Not found!");
      return null;
    } else {
      console.log("user found");
      return user?.toJSON();
    }
  } catch (e) {
    console.log("err while trying to find user", e);
    return null;
  }
}
