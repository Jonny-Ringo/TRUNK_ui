import { useEffect, useState, CSSProperties } from 'react';
// import ClipLoader from "react-spinners/ClipLoader";
import PulseLoader from "react-spinners/PulseLoader";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    // borderColor: "#9ECBFF",
    // color: "#9ECBFF",
  };


const Spinner = () => {

    return (
        <div className="flex flex-col items-center justify-center">
        <PulseLoader
            color={"#9ECBFF"}
            loading={true}
            cssOverride={override}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
            speedMultiplier={1.1}
        />
        </div>
    );
}

export default Spinner;