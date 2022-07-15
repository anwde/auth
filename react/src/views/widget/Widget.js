import React from "react";
import { CardColumns } from "reactstrap";
import {
  RecentSales,
  Chat,
  TodoList,
  UserProfileCard,
  TotalEarnings,
  Feeds,
  VisitCountries,
} from "../../components/dashboard";

const Widgets = () => {
  return (
    <CardColumns>
      <TodoList />
      <RecentSales />
      <Chat />
      <UserProfileCard />
      <TotalEarnings />
      <Feeds />
      <VisitCountries />
    </CardColumns>
  );
};

export default Widgets;
