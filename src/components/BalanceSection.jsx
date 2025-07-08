import React, { useState } from "react";
import "../css/DashboardHome.css";

const investments = [
    { name: "Apple", value: "$129.89", change: "+3.5%" },
    { name: "Tesla", value: "$210.82", change: "-1.2%" },
    { name: "Amazon", value: "$115.33", change: "+0.8%" },
    { name: "Google", value: "$198.45", change: "+2.1%" },
    { name: "Meta", value: "$155.70", change: "-0.5%" },
    { name: "Netflix", value: "$300.00", change: "+1.2%" }
];

export default function BalanceSection() {
    const [showBalance, setShowBalance] = useState(false);
    const visibleInvestments = investments.slice(0, 5);

    return (
        <div className="dashboard-container">
            <section className="balance-section">
                <div className="balance-header">
                    <h3>Balance</h3>
                    <div className="balance-amount">
                        {/* <span>{showBalance ? "$10 524.15" : "*****"}</span> */}

                        <span className={`balance-text ${showBalance ? "visible" : "hidden"}`}>
                            {showBalance ? "$10 524.15" : "**********"}
                        </span>

                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            className="icon-button"
                        >
                            {showBalance ? <i class="fa fa-eye-slash"></i> : <i class="fa fa-eye" />}
                        </button>
                    </div>
                </div>
                <div className="balance-actions">
                    <div className="balance-button">
                        <button>

                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.17999 10.16 8.48999 10.96 8.48999H12.84C13.76 8.48999 14.51 9.26999 14.51 10.24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12 7.5V16.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M22 6V2H18" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M17 7L22 2" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                        <button>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.17999 10.16 8.48999 10.96 8.48999H12.84C13.76 8.48999 14.51 9.26999 14.51 10.24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12 7.5V16.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M17 3V7H21" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M22 2L17 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                        <button>

                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2C3 7.0799 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.0799 21 8.2V12M3 9H21M18 21V15M21 18.0008L15 18" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                        <button>
                            <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                    <div className="balance-label">
                        <label>Send</label>
                        <label>Receive</label>
                        <label>Top Up</label>
                        <label>Freeze</label>
                    </div>
                </div>
            </section>
        </div>
    );
}
