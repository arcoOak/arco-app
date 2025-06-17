import { useState } from "react";

export default function Comercio() {
    const [activeDiv, setActiveDiv] = useState(0);

    const handleDivClick = (index) => {
        if (activeDiv === index) {
            setActiveDiv(0); // Collapse the div if it's already active
            return;
        }
        setActiveDiv(index);
    };
    return (
        <div className="container-fluid">
            <h1>Comercio</h1>
        </div>
    );
}
