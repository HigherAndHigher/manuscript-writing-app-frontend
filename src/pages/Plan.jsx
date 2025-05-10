import axios from "axios";
import { BackendURL } from "../components/untile";
import { useNavigate } from "react-router-dom";
import Plan_card from "./reusable_component/plan_card";

const Plan = () => {
  return (
    <div className="max-w-full h-[100vh] flex flex-col sm:flex-row justify-around items-center text-[30px] px-4 sm:px-96 bg-gray-50 dark:bg-gray-900">
      <Plan_card plan="FREE plan" price="0" count="10" state={false} />
      <Plan_card plan="PRO plan" price="10" count="30" state={true} />
    </div>
  );
};

export default Plan;
