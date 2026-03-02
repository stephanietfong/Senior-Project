import { Outlet } from "react-router-dom";
import { SectionHeader } from "./SectionHeader";

export function SectionHeaderLayout() {
  return (
    <>
      <SectionHeader />
      <Outlet />
    </>
  );
}