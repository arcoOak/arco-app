import Carousel from '../components/Carousel'; // Importa tu componente Carousel
import NewsSection from '../components/NewsSection'; // Importa tu componente Carousel
import '../css/Home.css';

export default function Home() {

    /* const myCarouselItems = [
        { id: 1, content: 'Item 1', img: 'card5' },
        { id: 2, content: 'Item 2', img: 'card2' },
        { id: 3, content: 'Item 3', img: 'card4' }
    ]; */

    const transactions = [
        { date: "JUL 1", amount: "-$1,750" },
        { date: "JUN 1", amount: "-$1,750" },
        { date: "MAY 1", amount: "-$1,750" },
        { date: "APR 1", amount: "-$1,750" },
        { date: "MAR 1", amount: "-$1,750" },
    ];

    return (
        <div className="container-fluid">
            <div className="home-container">
                <h2 className='mt-4'>Bienvenido, Johny</h2>

                <div className="header">
                    <div className="avatar"></div>
                    <div className="balance-info">
                        <h1>$297,000</h1>
                        <p className="monthly">$1,750 due per month</p>
                        <button className="add-btn">+ Add Transaction</button>
                        <p className="debt-open">Debt opened on May 3, 2017</p>
                    </div>
                </div>

                <div className="status">
                    <div className="progress-ring">
                        <svg className="progress-svg" viewBox="0 0 36 36">
                            <path
                                className="circle-bg"
                                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="circle"
                                strokeDasharray="7, 100"
                                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className="percentage" textAnchor="middle">7%</text>
                        </svg>
                    </div>
                    <div>
                        <p className="next-payment-label">Next payment due on</p>
                        <p className="next-payment-date">Thursday, August 1, 2024</p>
                        <p className="due-days">In 29 days</p>
                    </div>
                </div>

                <div className="transactions">
                    <h3>Transacciones</h3>
                    {transactions.map((tx, index) => (
                        <div className="transaction" key={index}>
                            <span className="tx-date">{tx.date}</span>
                            <span>
                                <p>Payment Applied</p>
                                <p className="on-time">$ On-Time Payment</p>
                            </span>
                            <span className="tx-amount">{tx.amount}</span>
                        </div>
                    ))}
                    <div className="all-transactions">All Transactions ➔</div>
                </div>
                {/* <div className="cards">
                    <Carousel items={myCarouselItems} />
                </div>
                <div className="summary mt-3">
                    <div className="summary-item br">
                        <label>Saldo</label>
                        <h3>1,234.56$</h3>
                    </div>
                    <div className="summary-item br ">
                        <label>Gastos</label>
                        <h3>456.78$</h3>
                    </div>
                    <div className="summary-item">
                        <label>Pendientes</label>
                        <h3>580$</h3>
                    </div>
                </div>
                <div className="bills mt-4">
                    <div className="billcard">
                        <span className='billcard_span'>CARD</span>
                        <span className='billcard__number'>**** **** **** 5432</span>
                        <button className='billcard_button'>Remove</button>
                    </div>
                    <div className="billcard">
                        <span className='billcard_span'>CARD</span>
                        <span className='billcard__number'>**** **** **** 5555</span>
                        <button className='billcard_button'>Remove</button>
                    </div>
                    <div className="billcard">
                        <span className='billcard_span'>CARD</span>
                        <span className='billcard__number'>**** **** **** 6784</span>
                        <button className='billcard_button'>Remove</button>
                    </div>
                </div> */}
                <NewsSection /> {/* Aquí añades la sección de noticias */}
            </div>
        </div>
    );
}
