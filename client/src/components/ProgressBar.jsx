import React from "react";

const calculatePercentage = (player, wordsLength) => {
  if (player.currentWordIndex !== 0) {
    return ((player.currentWordIndex / wordsLength) * 100).toFixed(2) + "%";
  }
};

const ProgressBar = ({ player, players, wordsLength }) => {
  const percentage = calculatePercentage(player, wordsLength);

  return (
    <div>
      <h5 className="text-left">{player.nickname}</h5>
      <div className="progress my-1" key={player.id}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: percentage }}
        >
          {percentage}
        </div>
      </div>
      {players.map((playerObj) => {
        const percentage = calculatePercentage(playerObj, wordsLength);
        return player._id !== playerObj._id ? (
          <div>
            <h5 className="text-left">{playerObj.nickname}</h5>
            <div className="progress my-1" key={player.id}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: percentage }}
              >
                {percentage}
              </div>
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};

export default ProgressBar;
