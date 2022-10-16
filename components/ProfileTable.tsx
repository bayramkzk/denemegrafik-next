import { parseIntoNames, stringifyGroup } from "@/utils/user";
import { Table } from "@mantine/core";
import { Role } from "@prisma/client";
import React from "react";
import SessionGuard from "./SessionGuard";

export interface ProfileTableProps {}

const ProfileTable: React.FC<ProfileTableProps> = () => {
  return (
    <SessionGuard allowedRoles={[Role.STUDENT]}>
      {({ user }) => {
        const { firstName, lastName } = parseIntoNames(user.profile.name);

        return (
          <Table>
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Değer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ad</td>
                <td>{firstName}</td>
              </tr>
              <tr>
                <td>Soyad</td>
                <td>{lastName}</td>
              </tr>
              <tr>
                <td>Okul</td>
                <td>{user.profile.group.organization.name}</td>
              </tr>
              <tr>
                <td>Sınıf</td>
                <td>{stringifyGroup(user.profile.group)}</td>
              </tr>
            </tbody>
          </Table>
        );
      }}
    </SessionGuard>
  );
};

export default ProfileTable;
