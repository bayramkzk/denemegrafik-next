import { getFirstName, getLastName, stringifyClass } from "@/utils/user";
import { Table } from "@mantine/core";
import React from "react";
import SessionGuard from "./SessionGuard";

export interface ProfileTableProps {}

const ProfileTable: React.FC<ProfileTableProps> = () => {
  return (
    <SessionGuard>
      {(session) => {
        const names = getFirstName(session.user.student.name);
        const surname = getLastName(session.user.student.name);
        const className = stringifyClass(session.user.student.class);
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
                <td>{names}</td>
              </tr>
              <tr>
                <td>Soyad</td>
                <td>{surname}</td>
              </tr>
              <tr>
                <td>Okul</td>
                <td>{session.user.student.class.school.name}</td>
              </tr>
              <tr>
                <td>Sınıf</td>
                <td>{className}</td>
              </tr>
            </tbody>
          </Table>
        );
      }}
    </SessionGuard>
  );
};

export default ProfileTable;
