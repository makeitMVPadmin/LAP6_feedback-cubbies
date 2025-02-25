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
        return <HomePage currentUser={currentUser || emptyUser} />;
      case "feedback":
        return <PortfolioDetailsPage currentUser={currentUser || emptyUser} />;
      default:
        return <HomePage currentUser={currentUser || emptyUser} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md p-4">
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
      <div className="min-h-screen flex flex-col">
        <Toaster position="bottom-right" richColors />
      </div>
    </>
  );
}

export default App;
