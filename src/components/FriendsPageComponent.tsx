/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, ButtonGroup } from "@mui/material";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";

import { DataGrid, GridColumns } from "@mui/x-data-grid";
import axios from "axios";
import { idUniqueV2 } from "id-unique-protocol";

import React, { Dispatch, useState } from "react";
import { Link } from "react-router-dom";
import { config, requests } from "../requests/benice_api";

import "./FriendsPageComponent.css";

type dataPageTypes =
  | "friends_list"
  | "friends_invits_sent"
  | "friends_invits_received";

interface IFriend {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface IFriendPageData {
  type: dataPageTypes;
  users: IFriend[];
  columns: GridColumns;
}

const FriendsPageComponent: React.FC = () => {
  const [friendPageData, setFriendPageData]: [
    IFriendPageData,
    Dispatch<IFriendPageData>,
  ] = useState(null);

  async function friendsListAction(listType: dataPageTypes) {
    try {
      const { baseUrl } = config;
      const { users } = requests;

      const token = sessionStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `${token}`;

      const url = `${baseUrl}${users[`${listType}`]}`;
      const friendListData: IFriend[] = (await axios.get(url)).data[
        `${listType == "friends_list" ? "all_friends" : "all_requests"}`
      ];

      const columns: GridColumns = [
        { field: "name", headerName: "Name", width: 500 },
        { field: "email", headerName: "Email", width: 500 },
      ];

      const friend_page: IFriendPageData = {
        type: listType,
        users: friendListData,
        columns,
      };

      setFriendPageData(friend_page);
    } catch (e) {
      console.error(e);
    }
  }

  function columnRedirectHandler(link: string): void {
    window.location.href = link;
  }

  const buttonsFunc = {
    friendsList: () => friendsListAction("friends_list"),
    invitsReceiveds: () => friendsListAction("friends_invits_received"),
    invitsSents: () => friendsListAction("friends_invits_sent"),
  };

  return (
    <div>
      <header>
        <ButtonGroup
          variant="text"
          aria-label="text button group"
          className="button_group"
        >
          <Button onClick={buttonsFunc.friendsList}>Amigos</Button>
          <Button onClick={buttonsFunc.invitsReceiveds}>
            Pedidos Recebidos
          </Button>
          <Button onClick={buttonsFunc.invitsSents}>Pedidos Enviados</Button>
        </ButtonGroup>
      </header>
      <main className="content">
        {friendPageData == null || friendPageData.users.length == 0 ? (
          <h1 id="no_content">No Content</h1>
        ) : (
          <div className="table-area">
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    {friendPageData.columns.map((column) => {
                      const { headerName } = column;

                      return (
                        <TableCell key={idUniqueV2()}>{headerName}</TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {friendPageData.users.map((user) => {
                    const { name, email } = user;

                    return (
                      <TableRow
                        className="tableRow"
                        key={idUniqueV2()}
                        onClick={() => columnRedirectHandler(`/users/${email}`)}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {name}
                        </TableCell>
                        <TableCell>{email}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </main>
    </div>
  );
};

export { FriendsPageComponent };

// Esperar a internet voltar para que assim veja o funcionamento do dataGrid
