import React from "react";

const Loader:React.FC = ()=>{
    return <div className="component-loader">
        <p><span className=' fa-spin fa fa-sync'></span> Please Wait...</p>
    </div>
}

export default Loader;