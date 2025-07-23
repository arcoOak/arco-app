import '../css/Points.css'

export default function Points() {
    return (
        <div className="pointContainer">
            <div className="cardPoint target-weight-card">
                <div className="icon-container green">
                    <i className="fa fa-trophy"></i>
                </div>
                <div className="text-content">
                    <div className="label">Target Weight</div>
                    <div className="value">185 lbs</div>
                </div>
                <div className="percentage">96%</div>
                <button className="update-button light">Update</button>
            </div>

            <div className="cardPoint current-weight-card">
                <div>
                    <div className="icon-container purple">
                        <i className="fa fa-user"></i>
                    </div>
                    <div className="text-content">
                        <div className="label">Current Weight</div>
                        <div className="value">193 lbs</div>
                    </div>
                    <button className="update-button dark">Update</button>
                </div>
                <div className="reminder-message">
                    Remember to update this at least once a week so we can adjust your plan to hit your goal
                </div>
            </div>
        </div>
    )
}