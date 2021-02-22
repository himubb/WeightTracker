import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Weight",
            data: []
          }
        ]
      }
    };
  }
  // componentDidUpdate(prevProps) {
  //   if (prevProps.exercise !== this.props.exercise) {
  //     let chartData = this.state;
  //     chartData.datasets[0].data = [20, 30, 40];
  //     this.setState({ chartData });
  //   }
  // }
  componentDidMount() {
    axios
      .get("http://localhost:5000/exercises/")
      .then(response => {
        let chartData = {
          labels: [],
          datasets: [
            {
              label: "Weight",
              data: []
            }
          ]
        };
        console.log(response);
        chartData.datasets[0].data = response.data.map(currentexercise => {
          console.log(currentexercise.weight);
          return currentexercise.weight;
        });
        chartData.labels = response.data.map(currentexercise => {
          console.log(currentexercise.date.substring(0, 10));
          return currentexercise.date.substring(0, 10);
        });
        this.setState({ chartData });
      })
      .catch(error => {
        console.log(error);
      });
    console.log(this.state);
  }
  componentDidUpdate(nextProps) {
    console.log("in delete");
    console.log(nextProps.exercise);

    if (typeof nextProps.exercise !== []) {
      let chartData = this.state;
      console.log("in if");
      console.log(chartData);
      if (chartData !== []) {
        chartData.datasets[0].data = nextProps.exercises.map(
          currentexercise => {
            console.log(currentexercise.weight);
            return currentexercise.weight;
          }
        );
        chartData.labels = nextProps.exercise.map(currentexercise => {
          console.log(currentexercise.date.substring(0, 10));
          return currentexercise.date.substring(0, 10);
        });
        this.setState({ chartData });
        console.log("After set");
        console.log(this.state);
      }
    }
  }
  render() {
    return (
      <div>
        <Line
          onClick={this.props.handleClick}
          data={this.state.chartData}
          height={200}
          width={800}
          options={{ maintainAspectRatio: false }}
        />
      </div>
    );
  }
}

const Exercise = props => (
  <tr>
    <td>{props.exercise.username}</td>
    <td>{props.exercise.description}</td>
    <td>{props.exercise.duration}</td>
    <td>{props.exercise.date.substring(0, 10)}</td>
    <td>{props.exercise.weight}</td>

    <td>
      <Link to={"/edit/" + props.exercise._id}>edit</Link> |{" "}
      <a
        href="#"
        onClick={() => {
          props.deleteExercise(props.exercise._id);
        }}
      >
        delete
      </a>
    </td>
  </tr>
);
export default class ExerciseList extends Component {
  constructor(props) {
    super(props);
    this.deleteExercise = this.deleteExercise.bind(this);
    this.updateChart = this.updateChart.bind(this);
    this.state = { exercises: [] };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/exercises/")
      .then(response => {
        this.setState({ exercises: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  deleteExercise(id) {
    axios.delete("http://localhost:5000/exercises/" + id).then(response => {
      console.log(response.data);
    });

    this.setState({
      exercises: this.state.exercises.filter(el => el._id !== id)
    });
    this.updateChart();
  }
  updateChart() {
    return (
      <div>
        <LineChart exercise={this.state.exercises} />
      </div>
    );
  }
  exerciseList() {
    return this.state.exercises.map(currentexercise => {
      return (
        <Exercise
          exercise={currentexercise}
          deleteExercise={this.deleteExercise}
          key={currentexercise._id}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <h3>Logged Exercises</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Weight</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.exerciseList()}</tbody>
        </table>
        <div className="container">{this.updateChart()}</div>
      </div>
    );
  }
}
