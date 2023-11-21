class APP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: 25 * 60,
      breakLength: 5 * 60,
      currentTime: 25 * 60,
      paused: true,
      timeLeftMinutes: 25,
      timeLeftSeconds: "00",
      break: false
    };
    this.setLength = this.setLength.bind(this);
    this.setPaused = this.setPaused.bind(this);
    this.setReset = this.setReset.bind(this);
    this.countDown = this.countDown.bind(this);
    this.time = null;
  }

  setLength = (minutes, target) => {
    if (this.state.paused === true) {
      if (minutes > 0 && minutes < 61) {
        this.setState({
          [target]: minutes * 60,
        });
        if (target === "sessionLength") {
          this.setState({
            currentTime: minutes * 60
          });
        }
      }
    }
  };

  playAudio = () => {
    const audio = document.getElementById("beep");
    audio.play();
  };

  countDown = () => {
    if (this.state.currentTime === 0) {
      this.playAudio();
      if (this.state.break === false) {
        this.setState({
          currentTime: this.state.breakLength,
          break: true,
        });
      } else if (this.state.break === true) {
        this.setState({
          currentTime: this.state.sessionLength,
          break: false,
        });
      }
    } else {
      this.setState((prevState) => ({
        currentTime: prevState.currentTime - 1,
      }));
    }
  };

  setPaused = () => {
    this.setState((prevState) => {
      if (prevState.paused) {
        return { paused: false };
      } else {
        return { paused: true };
      }
    }, () => {
      if (!this.state.paused) {
        this.time = setInterval(this.countDown, 1000);
      } else {
        clearInterval(this.time);
      }
    });
  };

  setReset = () => {
    clearInterval(this.time);
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
    this.setState({
      sessionLength: 25 * 60,
      breakLength: 5 * 60,
      currentTime: 25 * 60,
      paused: true,
      break: false
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentTime !== this.state.currentTime) {
      let timeLeftMinutes = Math.floor(this.state.currentTime / 60);
      let timeLeftSeconds = this.state.currentTime % 60;

      if (timeLeftMinutes < 10) {
        timeLeftMinutes = "0" + timeLeftMinutes;
      }
      if (timeLeftSeconds < 10) {
        timeLeftSeconds = "0" + timeLeftSeconds;
      }

      this.setState(() => ({
        timeLeftMinutes: timeLeftMinutes,
        timeLeftSeconds: timeLeftSeconds,
      }));
    }
  }

  render() {
    return (
      <div className="container-fluid d-flex align-items-center justify-content-center" style={{ background: "#333", height: "100vh" }}>
        <div className="text-center">
          <div className="row">
            <div className="col-md-6">
              <div className="text-center">
                <h3 className="text-white mb-4" id="break-label">Break Length</h3>
                <h2 className="text-white mb-4" id="break-length">{Math.floor(this.state.breakLength / 60)}</h2>
                <div className="btn-group">
                  <button
                    id="break-decrement"
                    className="btn btn-primary"
                    onClick={() => this.setLength(this.state.breakLength / 60 - 1, "breakLength")}
                  >
                    <i className="fas fa-arrow-down"></i>
                  </button>
                  <button
                    id="break-increment"
                    className="btn btn-primary"
                    onClick={() => this.setLength(this.state.breakLength / 60 + 1, "breakLength")}
                  >
                    <i className="fas fa-arrow-up"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="text-center">
                <h3 className="text-white mb-4" style={{ whiteSpace: "nowrap" }} id="session-label">Session Length</h3>
                <h2 className="text-white mb-4" id="session-length">{Math.floor(this.state.sessionLength / 60)}</h2>
                <div className="btn-group">
                  <button
                    id="session-decrement"
                    className="btn btn-primary"
                    onClick={() => this.setLength(this.state.sessionLength / 60 - 1, "sessionLength")}
                  >
                    <i className="fas fa-arrow-down"></i>
                  </button>
                  <button
                    id="session-increment"
                    className="btn btn-primary"
                    onClick={() => this.setLength(this.state.sessionLength / 60 + 1, "sessionLength")}
                  >
                    <i className="fas fa-arrow-up"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div id="clock" className="align-items-center">
            <div id="timer-label">
              {!this.state.break ? <div className="text-white font-weight-bold">Session</div> : <div className="text-white font-weight-bold">Break</div>}
            </div>
            <div id="time-left" className="text-white font-weight-bold display-4 mb-4 d-flex justify-content-center">
              {this.state.timeLeftMinutes}:{this.state.timeLeftSeconds}
            </div>
            <audio src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" id="beep"></audio>
            <button className="btn btn-primary" id="start_stop" style={{ width: "10%" }}onClick={() => this.setPaused()}>
              {this.state.paused ? <i className="fas fa-play"></i> : <i className="fas fa-pause"></i>}
            </button>
            <button className="btn btn-primary" id="reset" onClick={() => this.setReset()}>
              <i className="fas fa-rotate"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<APP />, document.getElementById("root"));