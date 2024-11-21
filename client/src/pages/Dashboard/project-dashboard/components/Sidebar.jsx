import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFolder, faTasks, faFileAlt, faUsers, faLifeRing , faClipboard} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { sidebarSelection } from '../../../../store/atoms/adminDashboardAtoms';
import { useDispatch } from "react-redux";
import { logout } from '../../../../redux/userSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import ProfileModal from '../../profile/ProfileModal';
import ResetPassword from "../../../../components/ResetPassword"

const IconItem = ({ icon, label, active = false }) => {
  return (
    <a
      href="#"
      className={`flex items-center p-2 rounded-lg hover:bg-gray-100 group transition-colors
        ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}`}
    >
      <FontAwesomeIcon 
        icon={icon} 
        className={`w-5 h-5 transition duration-75 
          ${active ? 'text-blue-600' : 'text-gray-700 group-hover:text-gray-900'}`}
      />
      <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
    </a>
  );
};

const Sidebar = ({ isOpen, onClose }) => {

  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const setSidebarSelection = useSetRecoilState(sidebarSelection);
  const [active, setActive] = useState("projects");
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!isModalOpen);
  const [isResetPasswordOpen, setResetPasswordOpen] = useState(false);

  const handleResetPasswordOpen = () => {
    setModalOpen(false); // Close ProfileModal
    setResetPasswordOpen(true); // Open ResetPassword
  };

  useEffect(() => {
    // On initial render automatically set selection to 'projects'
    setSidebarSelection("projects");
  }, [setSidebarSelection]);

  const handleLogout = () => {
    // Clear local storage items
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    dispatch(logout());

    // Redirect to home page
    navigate('/');
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
  };

  return (
    <>
    
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 h-full bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-10
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-56`}>
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-center relative">
            <div className="text-2xl font-bold">Team Sync</div>
            <button 
              onClick={onClose} 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors absolute right-4"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-0.5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 mx-6"></div>

          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              <li onClick={() => {
                  navigate('/');
                }}><IconItem icon={faHome} label="Home" />
                </li>
              <li onClick={() => {
                setSidebarSelection("your-projects");
                setActive("your-projects");
              }}>
                <IconItem icon={faFolder} label="Your projects" active={active === "your-projects"} />
              </li>
              <li onClick={() => {
                setSidebarSelection("projects");
                setActive("projects");
              }}>
                <IconItem icon={faFolder} label="Assigned projects" active={active === "projects"} />
              </li>
              <li onClick={()=>{
                setActive("tasks");
                setSidebarSelection("tasks");
              }}><IconItem icon={faTasks} label="Assigned Tasks" active={active==="tasks"} /></li>

              <li onClick={()=>{
                setActive("created-tasks");
                setSidebarSelection("created-tasks");
              }}><IconItem icon={faTasks} label="Created Tasks" active={active==="created-tasks"} /></li>

              <li onClick={() => {
                setActive("manager");
                setSidebarSelection("manager");
              }}
              ><IconItem icon={faFileAlt} label="File Manager" active={active === "manager"} /></li>


              <li onClick={() => {
                setActive("users");
                setSidebarSelection("users");
              }}>
                <IconItem icon={faUsers} label="Users" active={active === "users"} />
              </li>


              <li  onClick={() => {
                setActive("support");
                setSidebarSelection("support");
              }}
              ><IconItem icon={faLifeRing} label="Support"  active={active === "support"} /></li>

              <li  onClick={() => {
                setActive("notes");
                setSidebarSelection("notes");
              }}
              ><IconItem icon={faClipboard} label="Create Notes"  active={active === "notes"} /></li>
            </ul>
          </nav>

          <div className="p-4 mt-auto">
            <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 mb-4"></div>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => {toggleModal()}}>
              <img
                className="w-10 h-10 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="User Profile"
              />
              <div>
              <p className="font-semibold text-gray-800">
                {truncateText(userName || 'Guest', 16)}
              </p>
              <p className="text-sm text-gray-500">
                {truncateText(userEmail || 'No email', 16)}
              </p>

              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors"
            >
              Logout <LogoutIcon />
            </button>
          </div>
        </div>
        
      </aside>
      {isModalOpen && <ProfileModal isOpen={isModalOpen} onClose={toggleModal} onResetPassword={handleResetPasswordOpen} />}

      {isResetPasswordOpen && (
        <ResetPassword
          setResetPasswordOpen={setResetPasswordOpen}
          setSignInOpen={() => {/* handle sign-in open if needed */}}
        />
      )}
    </>
  );
};

export default Sidebar;
