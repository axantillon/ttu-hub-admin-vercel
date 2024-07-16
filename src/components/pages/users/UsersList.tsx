import { User } from "@prisma/client";
import { FC } from "react";
import UserItem from "./UserItem";

interface UsersListProps {
  users: User[];
}

const UsersList: FC<UsersListProps> = ({ users }) => {
  return (
    <div className="flex flex-col w-full gap-2">
      {users.map((user) => {
        return <UserItem key={user.id} user={user} />;
      })}
    </div>
  );
};

export default UsersList;
