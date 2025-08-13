import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome to Visit Ethiopia</h1>
          <p>Discover the beauty and culture of Ethiopia</p>
        </div>
        
        <div className="dashboard-content-card">
          <h2 className="dashboard-content-title">
            Explore Ethiopia's Wonders
          </h2>
          <p className="dashboard-content-text">
            From the ancient rock-hewn churches of Lalibela to the stunning landscapes of the Simien Mountains, 
            Ethiopia offers visitors a unique blend of history, culture, and natural beauty. 
            Plan your journey to this remarkable country and experience its rich heritage.
          </p>
          
          <div className="dashboard-features">
            <div className="dashboard-feature-card">
              <h3 className="dashboard-feature-title">Historical Sites</h3>
              <p className="dashboard-feature-text">
                Visit ancient churches, castles, and archaeological sites that tell the story of Ethiopia's rich history.
              </p>
            </div>
            
            <div className="dashboard-feature-card">
              <h3 className="dashboard-feature-title">Natural Beauty</h3>
              <p className="dashboard-feature-text">
                Explore mountains, lakes, and national parks that showcase Ethiopia's diverse landscapes.
              </p>
            </div>
            
            <div className="dashboard-feature-card">
              <h3 className="dashboard-feature-title">Cultural Experience</h3>
              <p className="dashboard-feature-text">
                Immerse yourself in local traditions, music, dance, and cuisine from different regions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 