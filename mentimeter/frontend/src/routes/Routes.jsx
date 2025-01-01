import { Route, Routes } from "react-router";
import ClientJoin from "../pages/client/ClientJoin";
import QuizPlayground from "../pages/client/QuizPlayground";
import AdminPannel from "../pages/admin/AdminPannel";
import QuizPannel from "../pages/admin/QuizPannel";
import ClientName from "../pages/client/Clientname";
import QuestionCraftPannel from "../pages/admin/QuestionCraftPannel";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<ClientJoin />} />
      <Route path="quiz/playername" element={<ClientName />} />
      <Route path="quiz/:sessioncode/playground" element={<QuizPlayground />} />
      <Route path="/adminpannel" element={<AdminPannel />} />
      <Route path="/question/create" element={<QuestionCraftPannel />} />
      <Route path="/question/Edit/:quizId" element={<QuestionCraftPannel />} />
      <Route path="/quiz/:quizId" element={<QuizPannel />} />
    </Routes>
  );
};

export default AppRoutes;
