import { useSelector } from "react-redux";

export const useBalance = () => {
  return useSelector((state: { balance: number }) => state.balance);
};
