import './App.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { ThemeProvider } from "@material-ui/styles"
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
})

class EventCard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <ThemeProvider theme={theme}>
          <Box m={1}>
            <Card style={{minWidth: 400, pallete: { type: "dark" }}}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Event {this.props.index + 1}:
              </Typography>
              <Typography variant="h5">
                {this.props.data}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => this.props.handleDelete(this.props.index)}>Delete</Button>
            </CardActions>
          </Card>
        </Box>
      </ThemeProvider>
    )
  }
}

class AddButton extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleSubmission = this.handleSubmission.bind(this);

    this.state = {
      errorText: '',
      error: false,
      text: '',
    }
  }

  onChange(event) {
    this.setState({ text: event.target.value })
    if(event.target.value.length === 0) {
      this.setState({ errorText: "New event cannot be empty", error: true})
    } else {
      this.setState({ errorText: "", error: false })
    }
  }

  handleSubmission(e) {
    e.preventDefault()
    this.props.handleAdd(this.state.text)
    this.setState({ text: "" })
  }

  render() {
    return(
      <form onSubmit={(e) => this.handleSubmission(e)}>
          <TextField
            value={this.state.text} 
            required={true}
            id="filled-basic"
            error={this.state.error}
            label="New Event" 
            variant="filled"
            helperText={this.state.text === "" && !this.state.error ? "Add a new Event!" : this.state.text === "" && this.state.error ? "Field cannot be empty" : ""}
            errorText={this.state.errorText} 
            onChange={this.onChange.bind(this)}
            style={{marginTop: 15}}
            InputProps={{
              theme: theme
            }}
          />
      </form>
    )
  }
}

class EventStack extends React.Component {
  constructor(props) {
    super(props);

    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state={
      events: [],
    }
  }

  handleAdd(event) {
     this.setState((prevState) => {
      let { events } = prevState;
      return {
        events: events.concat({key: events.length, data: event})
      }
    }); 
  }

  handleDelete(index) {
    this.setState((prevState) => {
      let events = prevState.events.slice();
      events.splice(index, 1);
      return { events: events }
    })
  }

  render() {
    let eventBoxes = this.state.events.map((event, index) => {
      return <EventCard key={index} index={index} data={event.data} handleDelete={this.handleDelete} />
    })
    return (
      <div id="event-container">
        <AddButton handleAdd={this.handleAdd} />
        {eventBoxes}
      </div>
    )
  }
}

function App() {
  return (
    <EventStack />
  )
}

export default App;
