import "../css/DashboardHome.css";
import Transacctions  from "./Transacctions";

export default function TransacctionSection() {

    const statPay = 'pay';
    const amount = 500;

    const transacctionsHistory = [
        { id: 1, account: 'binance', amount: 50, date: '04/2025', concept: 'Mensualidad' },
        { id: 2, account: 'credito', amount: 45, date: '03/2025', concept: 'Mensualidad' },
        { id: 3, account: 'zelle', amount: 43, date: '02/2025', concept: 'Mensualidad' },
        { id: 4, account: 'paypal', amount: 40, date: '01/2025', concept: 'Mensualidad' },
    ];

    return (
        <div className="dashboard-container">
            <section className="investments-section">
                <div className="investments-header">
                    <h3>Transacciones</h3>
                    <button className="view-all">View all</button>
                </div>
                <div className="statistics-placeholder">
                    {transacctionsHistory.map(item => (
                        <div
                            key={item.id}
                            onClick={() => handleHistoryItemClick(item.id)}
                            className="history-item-clickable"
                        >
                            <Transacctions
                                id={item.id}
                                account={item.account}
                                amount={item.amount}
                                date={item.date}
                                concept={item.concept}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
