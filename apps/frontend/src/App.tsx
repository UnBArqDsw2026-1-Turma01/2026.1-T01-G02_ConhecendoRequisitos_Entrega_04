import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { CadastroPage } from "./pages/CadastroPage";
import { RecuperarSenhaPage } from "./pages/RecuperarSenhaPage";
import { AvailableTracks } from "./pages/AvailableTracks";
import { TrailPage } from "./pages/TrailPage";
import { LessonPage } from "./pages/LessonPage";
import { QuizPage } from "./pages/QuizPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>
            {/* Rotas públicas */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/cadastro"
                element={<CadastroPage />}
            />

            <Route
                path="/recuperar-senha"
                element={<RecuperarSenhaPage />}
            />

            {/* Rotas protegidas */}
            <Route
                path="/trails"
                element={<ProtectedRoute element={<AvailableTracks />} />}
            />

            <Route
                path="/trilhas"
                element={<ProtectedRoute element={<AvailableTracks />} />}
            />

            <Route
                path="/trails/:trailId"
                element={<ProtectedRoute element={<TrailPage />} />}
            />

            <Route
                path="/trails/:trailId/lesson/:lessonId"
                element={<ProtectedRoute element={<LessonPage />} />}
            />

            <Route
                path="/trails/:trailId/lesson/:lessonId/exercicios"
                element={<ProtectedRoute element={<QuizPage />} />}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
export default App;