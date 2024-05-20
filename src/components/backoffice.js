import Navbar from './narbar';
import Sidebar from './sidebar';
import Footer from './footer';
import Controlsidebar from './controlSidebar';

function Backoffice(prop){
    return<>
   
    <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className='content-wrapper p-2'> {prop.children}</div>
      
    </div>
        <Footer />
        <Controlsidebar />
    </>
}
export default Backoffice