import NotificationDrawer from "./components/NotificationDrawer/NotificationDrawer";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import { UserProvider, useUser } from "./context/UserContext";
import HomePage from "./pages/HomePage";
import PortfolioDetailsPage from "./pages/PortfolioDetailsPage";
import TopNav from "@/components/TopNav/TopNav";
import "./App.css";
import { emptyUser } from "./firebase/functions/fetchUsers";
import { Toaster } from "sonner";

function AppContent() {
  const { currentPage, goToProfileDetails, isDrawerOpen, closeDrawer } =
    useNavigation();
  const { usersList, currentUser, handleUserLogin } = useUser();

  const renderPage = () => {

    switch (currentPage) {
      case "home":
        return <HomePage/>;
      case "feedback":
        return <PortfolioDetailsPage/>;
      default:
        return <HomePage/>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0954b0]">
      <header >
        <TopNav
          setCurrentPage={goToProfileDetails}
          currentPage={currentPage}
          notificationCount="999"
          currentUser={currentUser || emptyUser}
          usersList={usersList}
          handleUserLogin={handleUserLogin} // Pass login function
        />
      </header>
      <main className="flex-grow p-4">{renderPage()}</main>

      {/* Notification Drawer */}
      <NotificationDrawer
        currentUser={currentUser || emptyUser}
        isOpen={isDrawerOpen}
        onClose={() => closeDrawer()}
      />
    </div>
  );
}

function App() {
  return (
    <>
      <NavigationProvider>
        <UserProvider>
          {" "}
          {/* Wrap AppContent with UserProvider */}
          <AppContent />
        </UserProvider>
      </NavigationProvider>
      <div className="min-h-full flex flex-col">
        <Toaster position="bottom-right" richColors />
      </div>
    </>
  );
}

export default App;
