
import React from "react";

const PageNotFound:React.FC = ()=>{
    return <div className='page no-data-found-page animate-fade-in'>
       <div className="content">
       <h1><span className=' fa fa-circle-exclamation'  ></span> Resource Not Found</h1>
       <p>
       We apologize, but the requested resource cannot be found. It seems the page you're looking for may have been removed or does not exist. Please check the URL for errors or return to the homepage. For assistance, contact support. Thank you.
       </p>
       </div>
    </div>
}
export  default PageNotFound;