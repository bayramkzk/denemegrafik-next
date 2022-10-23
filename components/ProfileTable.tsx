import { roleDisplayNameMap } from "@/utils/role";
import { getSchool, parseIntoNames, stringifyClass } from "@/utils/user";
import { Table } from "@mantine/core";
import React from "react";
import SessionGuard from "./SessionGuard";

const ProfileTable: React.FC = () => {
  return (
    <SessionGuard>
      {({ user }) => {
        const { firstName, lastName } = parseIntoNames(user.name);

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
              {user.role === "STUDENT" && (
                <tr>
                  <td>Sınıf</td>
                  <td>{stringifyClass(user.class)}</td>
                </tr>
              )}
              <tr>
                <td>Kullanıcı Tipi</td>
                <td>{roleDisplayNameMap[user.role]}</td>
              </tr>
            </tbody>
          </Table>
        );
      }}
    </SessionGuard>
  );
};

export default ProfileTable;
