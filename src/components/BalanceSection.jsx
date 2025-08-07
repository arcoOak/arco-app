import React, { useState } from "react";
import "../css/DashboardHome.css";



export default function BalanceSection() {
    const [showBalance, setShowBalance] = useState(false);

    return (
            <div className="balance-section">
                <div className="balance-actions">
                    <div className="balance-button">
                        
                        <button>
                            <i class="fa-solid fa-wallet"></i>
                            <label>Recargar</label>
                        </button>
                        
                    </div>
                    
                </div>
            </div>
    );
}
