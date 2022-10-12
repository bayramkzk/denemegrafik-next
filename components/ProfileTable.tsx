import {
  getName,
  getSchool,
  parseIntoNames,
  stringifyClass,
} from "@/utils/user";
import { Table } from "@mantine/core";
import React from "react";
import SessionGuard from "./SessionGuard";

export interface ProfileTableProps {}

const ProfileTable: React.FC<ProfileTableProps> = () => {
  return (
    <SessionGuard>
      {({ user }) => {
        const { firstName, lastName } = parseIntoNames(getName(user));

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
                <td>{getSchool(user).name}</td>
              </tr>
              {user.student && (
                <tr>
                  <td>Sınıf</td>
                  <td>{stringifyClass(user.student.class)}</td>
                </tr>
              )}
            </tbody>
          </Table>
        );
      }}
    </SessionGuard>
  );
};

export default ProfileTable;
