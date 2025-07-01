import { BrowserRouter } from "react-router-dom";
import WebsiteRoutes from "./WebsiteRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <WebsiteRoutes />
    </BrowserRouter>
  );
};

export default App;
