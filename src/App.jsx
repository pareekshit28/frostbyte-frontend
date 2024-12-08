import Navbar from "./components/Navbar";
import { Providers } from "./components/Providers";
import OnBoardingPage from "./pages/OnBoardingPage";
import HomePage from "./pages/HomePage";
import "@coinbase/onchainkit/styles.css";

function App() {
  return (
    <Providers>
      <>
        <Navbar />
        {localStorage.getItem("address") ? <HomePage /> : <OnBoardingPage />}
      </>
    </Providers>
  );
}

export default App;
